from typing import Generic, TypeVar, Union, Any, List
from pydantic import BaseModel, ConfigDict

T = TypeVar('T')


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    limit: int
    offset: int

class APIResponse(BaseModel, Generic[T]):
    code: int
    message: str
    data: Union[T, List[T], dict, List[Any]] = []
    requestStatus: bool
    model_config = ConfigDict(from_attributes=True)
    @classmethod
    def success(cls, message: str = "Operation successful", data: Any = None, code: int = 200):
        """Helper method to return a successful standardized envelope"""
        return cls(
            code=code, 
            message=message, 
            data=data if data is not None else [], 
            requestStatus=True
        )

    @classmethod
    def fail(cls, message: str = "An error occurred", code: int = 400, data: Any = None):
        """Helper method to return a failed standardized envelope"""
        return cls(
            code=code, 
            message=message, 
            data=data if data is not None else [], 
            requestStatus=False
        )