from fastapi import APIRouter

router = APIRouter()

@router.get("/login/", tags=["users"])
async def login():
    return [{"username": "Rick"}, {"username": "Morty"}]


@router.get("/users/me", tags=["users"])
async def reauth():
    return {"username": "fakecurrentuser"}


@router.get("/logout/{username}", tags=["users"])
async def logout(username: str):
    return {"username": username}


