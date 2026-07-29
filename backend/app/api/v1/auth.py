from fastapi import APIRouter, Depends, Header, status
from sqlalchemy.orm import Session

from app.schemas.response_schema import APIResponse
from app.schemas.auth_schema import LoginRequest, TokenPairResponse
from app.services.auth_service import AuthService
from app.core.database import get_db

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=APIResponse[TokenPairResponse])
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authenticates enterprise credentials and issues token parameters."""
    tokens = AuthService.authenticate_user(db, payload)
    return APIResponse.success(message="Authentication successful", data=tokens)


@router.post("/logout", response_model=APIResponse[dict])
def logout(
    refresh_token: str = Header(..., description="The refresh token string to invalidate"), 
    db: Session = Depends(get_db)
):
    """Invalidates the provided session refresh token to securely terminate authorization context."""
    AuthService.revoke_refresh_token(db, refresh_token)
    return APIResponse.success(message="Successfully logged out and session revoked", data={})