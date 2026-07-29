from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.permission_model import Permission

class PermissionService:
    @staticmethod
    def get_all_permissions(
        db: Session, 
        limit: int = 100, 
        offset: int = 0, 
        is_active: Optional[bool] = None,
        search: Optional[str] = None
    ) -> List[Permission]:
        """
        Business logic for retrieving a flat list of system permissions.
        """
        query = db.query(Permission)
        
        if is_active is not None:
            query = query.filter(Permission.is_active == is_active)
        
        if search:
            # Filters by the permission slug (e.g., 'user:write')
            query = query.filter(Permission.slug.ilike(f"%{search}%"))
            
        return query.order_by(Permission.slug.asc()).offset(offset).limit(limit).all()