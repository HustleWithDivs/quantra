from uuid import UUID
from datetime import datetime
from fastapi import HTTPException, status
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.role_model import Role, RolePermission
from app.models.permission_model import Permission # Assuming this exists
from app.schemas.role_schema import RoleCreate, RoleUpdate

class RoleService:
    @staticmethod
    def get_all_roles(
        db: Session, 
        limit: int = 100, 
        offset: int = 0, 
        is_active: Optional[bool] = None,
        search: Optional[str] = None
    ) -> List[Role]:
        """
        Business logic for retrieving a flat list of system roles.
        """
        query = db.query(Role)
        
        if is_active is not None:
            query = query.filter(Role.is_active == is_active)
        
        if search:
            query = query.filter(Role.role_name.ilike(f"%{search}%"))
            
        return query.order_by(Role.role_id.asc()).offset(offset).limit(limit).all()

    @staticmethod
    def create_role_with_permissions(db: Session, role_in: RoleCreate, current_user_id: Optional[UUID] = None) -> Role:
        # 1. Check if role name already exists
        existing_role = db.query(Role).filter(Role.role_name == role_in.role_name).first()
        if existing_role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Role with name '{role_in.role_name}' already exists."
            )

        # 2. If permissions are provided, validate they ALL exist (Atomic rule)
        if role_in.permission_ids:
            distinct_input_ids = set(role_in.permission_ids)
            existing_permissions_count = db.query(Permission).filter(
                Permission.permission_id.in_(distinct_input_ids)
            ).count()
            
            if existing_permissions_count != len(distinct_input_ids):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="One or more provided permission IDs do not exist. Transaction aborted."
                )

        try:
            # 3. Instantiate and save the new role
            new_role = Role(
                role_name=role_in.role_name,
                description=role_in.description,
                is_active=role_in.is_active,
                created_by=current_user_id
            )
            db.add(new_role)
            db.flush() # Flushes to database to generate new_role.role_id without committing

            # 4. Insert records into junction role_permissions table
            for perm_id in role_in.permission_ids:
                role_perm = RolePermission(role_id=new_role.role_id, permission_id=perm_id)
                db.add(role_perm)

            # 5. Commit the whole batch atomically
            db.commit()
            db.refresh(new_role)
            return new_role

        except Exception as e:
            db.rollback() # Full rollback on any unexpected system failures
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create role due to a database error: {str(e)}"
            )
    
    @staticmethod
    def get_role_by_id(db: Session, role_id: UUID) -> Role:
        """
        Fetches a single role by its unique UUID along with its associated permissions.
        Raises a 404 error if the role does not exist.
        """
        role = db.query(Role).filter(Role.role_id == role_id).first()
        
        if not role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Role with ID '{role_id}' could not be found."
            )
            
        return role
    @staticmethod
    def update_role(db: Session, role_id: UUID, role_in: RoleUpdate, current_user_id: Optional[UUID] = None) -> Role:
        role = RoleService.get_role_by_id(db, role_id)
        
        # 1. Check unique name constraint if role name is changing
        if role_in.role_name and role_in.role_name != role.role_name:
            name_check = db.query(Role).filter(Role.role_name == role_in.role_name).first()
            if name_check:
                raise HTTPException(status_code=400, detail=f"Role name '{role_in.role_name}' is already taken.")
        
        # 2. Atomic Verification of new permission array if provided
        if role_in.permission_ids is not None:
            distinct_input_ids = set(role_in.permission_ids)
            if distinct_input_ids:
                existing_count = db.query(Permission).filter(Permission.permission_id.in_(distinct_input_ids)).count()
                if existing_count != len(distinct_input_ids):
                    raise HTTPException(status_code=422, detail="One or more provided permission IDs do not exist.")

        try:
            # 3. Update scalar fields
            update_data = role_in.model_dump(exclude_unset=True, exclude={'permission_ids'})
            for key, value in update_data.items():
                setattr(role, key, value)
            
            role.modified_at = datetime.utcnow()
            role.modified_by = current_user_id
            
            # 4. Sync many-to-many permissions if provided
            if role_in.permission_ids is not None:
                # Wipe current bindings for this role
                db.query(RolePermission).filter(RolePermission.role_id == role_id).delete()
                # Insert the fresh payload bindings
                for perm_id in role_in.permission_ids:
                    db.add(RolePermission(role_id=role_id, permission_id=perm_id))
            
            db.commit()
            db.refresh(role)
            return role
            
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to update role: {str(e)}")

    @staticmethod
    def delete_role(db: Session, role_id: UUID) -> None:
        role = RoleService.get_role_by_id(db, role_id)
        try:
            # Delete references in junction table first
            db.query(RolePermission).filter(RolePermission.role_id == role_id).delete()
            # Delete the role entity
            db.delete(role)
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to delete role: {str(e)}")