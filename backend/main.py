from fastapi import FastAPI, Security, Depends
# from utils import VerifyToken
from dependencies.auth import validate_token, Auth0User
from fastapi.middleware.cors import CORSMiddleware

# Creates app instance
app = FastAPI()
#auth = VerifyToken()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/public")
def public():
    """No access token required to access this route"""

    result = {
        "status": "success",
        "msg": ("Hello from a public endpoint! You don't need to be "
                "authenticated to see this.")
    }
    return result


# @app.get("/api/private")
# def private(auth_result: str = Security(auth.verify)):
#     """A valid access token is required to access this route"""
#     result = {
#         "status": "success",
#         "msg": ("Hello from a private endpoint! You need to be "
#                 "authenticated to see this.")
#     }
#     return result


# @app.get("/api/private-scoped")
# def private_scoped(auth_result: str = Security(auth.verify, scopes=['read:messages'])):
#     """A valid access token and an appropriate scope are required to access
#     this route
#     """

#     return auth_result

@app.get("/api/protected")
async def protected_route(user: Auth0User = Depends(validate_token)):
    print(f"Auth0 User: {user.dict()}")
    return {
        "message": "Authenticated!",
        "user_id": user.sub,
        "email": user.email
    }

