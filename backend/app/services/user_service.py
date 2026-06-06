from uuid import UUID
from fastapi import HTTPException, status
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.role_model import Role
from app.models.user_model import User, UserRole
from app.schemas.user_schema import UserCreate, UserUpdate
from app.core.security import SecurityHelper
class UserService:
    @staticmethod
    def get_all_users(
        db: Session, 
        limit: int = 100, 
        offset: int = 0, 
        is_active: Optional[bool] = None,
        search: Optional[str] = None
    ) -> List[User]:
        """
        Retrieves users along with their associated role configurations using an eager JOIN lookup.
        """
        # joinedload pulls the associated roles efficiently in a single query
        query = db.query(User).options(joinedload(User.roles))
        
        if is_active is not None:
            query = query.filter(User.is_active == is_active)
        
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    User.first_name.ilike(search_filter),
                    User.last_name.ilike(search_filter),
                    User.email.ilike(search_filter)
                )
            )
            
        return query.order_by(User.created_at.desc()).offset(offset).limit(limit).all()
    
    @staticmethod
    def create_user_with_roles(db: Session, user_in: UserCreate, current_user_id: Optional[UUID] = None) -> User:
        # 1. Verify email uniqueness
        existing_email = db.query(User).filter(User.email == user_in.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"A user account with the email '{user_in.email}' already exists."
            )

        # 2. Verify all assigned roles exist atomically
        if user_in.role_ids:
            distinct_role_ids = set(user_in.role_ids)
            existing_roles_count = db.query(Role).filter(Role.role_id.in_(distinct_role_ids)).count()
            if existing_roles_count != len(distinct_role_ids):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="One or more provided Role IDs do not exist. Registration aborted."
                )

        try:
            # 3. Securely hash password and build user instance
            # secure_hash = pwd_context.hash(user_in.password)
            secure_hash = SecurityHelper.hash_password(user_in.password)
            
            new_user = User(
                first_name=user_in.first_name,
                last_name=user_in.last_name,
                email=user_in.email,
                password_hash=secure_hash,
                gender=user_in.gender,
                is_active=user_in.is_active,
                created_by=current_user_id
            )
            db.add(new_user)
            db.flush() # Secure user_id for junction bindings

            # 4. Map user to roles inside the same transaction context
            for r_id in user_in.role_ids:
                user_role_binding = UserRole(user_id=new_user.user_id, role_id=r_id)
                db.add(user_role_binding)

            db.commit()
            db.refresh(new_user)
            return new_user

        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create user account: {str(e)}"
            )
    @staticmethod
    def update_user(db: Session, user_id: UUID, user_in: UserUpdate, current_user_id: Optional[UUID] = None) -> User:
        # 1. Fetch user or raise 404
        user = db.query(User).filter(User.user_id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID '{user_id}' could not be found."
            )
        
        # 2. Check email unique constraint if it's changing
        if user_in.email and user_in.email != user.email:
            email_check = db.query(User).filter(User.email == user_in.email).first()
            if email_check:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Email '{user_in.email}' is already in use by another account."
                )
        
        # 3. Validate the single role if provided
        if user_in.role_id is not None:
            role_exists = db.query(Role).filter(Role.role_id == user_in.role_id).exists()
            if not db.query(role_exists).scalar():
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"The provided Role ID '{user_in.role_id}' does not exist."
                )

        try:
            # 4. Update basic user details
            update_data = user_in.model_dump(exclude_unset=True, exclude={'role_id'})
            for key, value in update_data.items():
                setattr(user, key, value)
            
            user.modified_at = datetime.utcnow()
            user.modified_by = current_user_id
            
            # 5. Enforce single role mapping: clear previous roles, insert new one
            if user_in.role_id is not None:
                # Purge any existing roles for this user
                db.query(UserRole).filter(UserRole.user_id == user_id).delete()
                
                # Assign the single new role
                new_binding = UserRole(user_id=user_id, role_id=user_in.role_id)
                db.add(new_binding)
                
            db.commit()
            db.refresh(user)
            return user
            
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update user record: {str(e)}"
            )
    @staticmethod
    def get_user_by_id(db: Session, user_id: UUID) -> User:
        """
        Fetches a single user profile along with their single assigned role.
        Raises a 404 error if the user is missing.
        """
        user = db.query(User).options(joinedload(User.roles)).filter(User.user_id == user_id).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User account with ID '{user_id}' could not be found."
            )
        return user

    @staticmethod
    def delete_user(db: Session, user_id: UUID) -> None:
        """
        Permanently removes a user record and purges their role assignment.
        """
        user = db.query(User).filter(User.user_id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User account with ID '{user_id}' could not be found."
            )
            
        try:
            # 1. Clear role assignment in junction table first
            db.query(UserRole).filter(UserRole.user_id == user_id).delete()
            
            # 2. Erase the core user account record
            db.delete(user)
            db.commit()
            
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete user account due to a database error: {str(e)}"
            )