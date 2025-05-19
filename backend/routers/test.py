from fastapi import APIRouter, Depends
from dependencies.auth import validate_token

router = APIRouter()

@router.get("/protected-route")
async def protected_route(user: dict = Depends(validate_token)):
    return {
        "message": "Authenticated!",
        "user_info": {
            "sub": user.get("sub"),
            "email": user.get("email")
        }
    }