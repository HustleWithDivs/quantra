import hashlib
import hmac
from passlib.context import CryptContext
import bcrypt
if not hasattr(bcrypt, "__about__"):
    bcrypt.__about__ = type('About', (object,), {"__version__": bcrypt.__version__})
# ─────────────────────────────────────────────────────────────



pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
class SecurityHelper:
    @staticmethod
    def hash_password(password: str) -> str:
        # Pre-hash with SHA-256 to convert any length password into a fixed 32-byte string
        pre_hashed = hashlib.sha256(password.encode("utf-8")).hexdigest()
        # Bcrypt handles the 32-byte string perfectly
        return pwd_context.hash(pre_hashed)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        pre_hashed = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
        return pwd_context.verify(pre_hashed, hashed_password)
        #return hmac.compare_digest(plain_password, hashed_password)