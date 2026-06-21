from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.exceptions import setup_exception_handlers
from app.core.database import engine, Base
from app.api.v1.auth import router as auth_router
from app.api.v1.roles import router as roles_router
from app.api.v1.permissions import router as permissions_router
from app.api.v1.users import router as users_router
from app.api.v1.customer import router as customer_router
from app.api.v1.brand import router as brand_router
from app.api.v1.supplier import router as supplier_router
from app.api.v1.color import router as color_router
from app.api.v1.size import router as size_router
from app.api.v1.business_category import router as business_category_router
from app.api.v1.department import router as department_router
from app.api.v1.category import router as category_router  
from app.api.v1.sub_category import router as sub_category_router  


# Auto-generate database tables on startup
Base.metadata.create_all(bind=engine)

# Initialize the Quantra Core Engine
app = FastAPI(
    title="Quantra API",
    description="Enterprise Access Control Kernel & Autonomous Operations Platform for Quantra",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
setup_exception_handlers(app)
app.include_router(auth_router, prefix="/api/v1")
app.include_router(customer_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(roles_router, prefix="/api/v1")
app.include_router(permissions_router, prefix="/api/v1")
app.include_router(brand_router, prefix="/api/v1")
app.include_router(supplier_router, prefix="/api/v1")
app.include_router(color_router, prefix="/api/v1")
app.include_router(size_router, prefix="/api/v1")
app.include_router(business_category_router, prefix="/api/v1")
app.include_router(department_router,prefix="/api/v1")
app.include_router(category_router,prefix="/api/v1")
app.include_router(sub_category_router,prefix="/api/v1")



@app.get("/", tags=["Root"])
def root_status():
    return {"status": "online", "system": "Quantra API Gateway"}