from fastapi import FastAPI, Request, status
from fastapi.exceptions import HTTPException, RequestValidationError
from fastapi.responses import JSONResponse

def setup_exception_handlers(app: FastAPI) -> None:
    """
    Registers global interceptors to format all system exceptions 
    into Quantra's unified enterprise JSON response format.
    """
    
    @app.exception_handler(HTTPException)
    async def custom_http_exception_handler(request: Request, exc: HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "code": exc.status_code,
                "message": exc.detail,
                "data": None,
                "requestStatus": False
            }
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "code": 422,
                "message": "Schema input validation failed.",
                "data": exc.errors(),
                "requestStatus": False
            }
        )
        
    @app.exception_handler(Exception)
    async def global_unhandled_exception_handler(request: Request, exc: Exception):
        """Catches any raw, unexpected Python crashes (like missing imports or DB disconnects)"""
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "code": 500,
                "message": f"An unexpected system error occurred: {str(exc)}",
                "data": None,
                "requestStatus": False
            }
        )