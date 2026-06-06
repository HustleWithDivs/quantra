from uuid import UUID
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import jwt # Using PyJWT or python-jose

from app.models.user_model import User
from app.models.auth_model import RefreshToken
from app.schemas.auth_schema import LoginRequest, TokenPairResponse
from app.core.security import SecurityHelper

SECRET_KEY = "your_enterprise_super_secret_key" # Replace with your config reference
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        # Replace this stub with: pwd_context.verify(plain_password, hashed_password)
        return SecurityHelper.verify_password(plain_password, hashed_password)
        

    @staticmethod
    def create_token(data: dict, expires_delta: timedelta) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + expires_delta
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    @staticmethod
    def authenticate_user(db: Session, login_data: LoginRequest) -> TokenPairResponse:
        user = db.query(User).filter(User.email == login_data.email, User.is_active == True).first()
        if not user or not AuthService.verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Create access and refresh tokens
        access_token = AuthService.create_token(
            data={"sub": str(user.user_id)}, 
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        refresh_token_str = AuthService.create_token(
            data={"sub": str(user.user_id)}, 
            expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        )

        # Store refresh token hash to database statefully
        # In production, use a fast hashing algorithm (like SHA256) on the string token
        db_refresh = RefreshToken(
            user_id=user.user_id,
            token_hash=refresh_token_str, # Storing directly for brevity; hashing is recommended
            expires_at=datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        )
        db.add(db_refresh)
        db.commit()

        return TokenPairResponse(access_token=access_token, refresh_token=refresh_token_str)

    @staticmethod
    def revoke_refresh_token(db: Session, refresh_token: str) -> None:
        """Business logic to invalidate a session on logout"""
        db_token = db.query(RefreshToken).filter(RefreshToken.token_hash == refresh_token).first()
        if db_token:
            db_token.is_revoked = True
            db.commit()