from fastapi import Depends, HTTPException, status
# 1. Import HTTPBearer and HTTPAuthorizationCredentials
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user_model import User
from app.services.auth_service import SECRET_KEY, ALGORITHM
from app.models.permission_model import Permission
from app.models.role_model import RolePermission

# 2. Replace OAuth2PasswordBearer with HTTPBearer
security_scheme = HTTPBearer()

# 3. Update the type hint to accept HTTPAuthorizationCredentials
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # 4. Extract the raw string token from credentials object
        token = credentials.credentials
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.user_id == user_id, User.is_active == True).first()
    if user is None:
        raise credentials_exception
    return user

class PermissionChecker:
    def __init__(self, *required_permissions: str):
        # Stores permissions as a collection (e.g., ("user:write", "audit:write"))
        self.required_permissions = required_permissions

    def __call__(self, current_user: "User" = Depends(get_current_user), db: Session = Depends(get_db)):
        user_role = current_user.roles[0] if current_user.roles else None
        if not user_role:
            raise HTTPException(status_code=403, detail="Access denied. No role assigned.")

        # Query counts how many of the required permissions this user actually possesses
        matching_permissions_count = db.query(Permission).join(
            RolePermission, RolePermission.permission_id == Permission.permission_id
        ).filter(
            RolePermission.role_id == user_role.role_id,
            Permission.slug.in_(self.required_permissions),
            Permission.is_active == True
        ).count()

        # If the count doesn't match the total number of permissions demanded, throw a 403
        if matching_permissions_count != len(self.required_permissions):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden. You lack one or more required permissions: {self.required_permissions}"
            )
            
        return current_user