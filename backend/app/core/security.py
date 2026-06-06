from passlib.context import CryptContext

# Configuration block telling Passlib to use bcrypt under the hood
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SecurityHelper:
    @staticmethod
    def hash_password(password: str) -> str:
        """Transforms a plain-text password string into a secure cryptographic hash."""
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Compares a plain text password against a stored hash to check if they match."""
        return pwd_context.verify(plain_password, hashed_password)