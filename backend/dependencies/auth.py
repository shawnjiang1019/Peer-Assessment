from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from pydantic import BaseModel
from application.config import get_settings

security = HTTPBearer()
settings = get_settings()


class Auth0User(BaseModel):
    sub: str
    email: str
    name: str

async def validate_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Auth0User:
    try:
        token = credentials.credentials
        jwks_url = f"https://{settings.auth0_domain}/.well-known/jwks.json"
        jwks_client = jwt.PyJWKClient(jwks_url)
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=settings.auth0_api_audience,
            issuer=settings.auth0_domain
        )
        return Auth0User(
            sub=payload.get("sub"),
            email=payload.get("email"),
            name=payload.get("name")
        )
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    

"""
[Client Request]  
       ↓
[Authorization: Bearer <JWT>]  
       ↓
Extract JWT from Header  
       ↓
Fetch JWKS from Auth0  
       ↓
Find Matching Public Key (via kid)  
       ↓
Verify Signature & Validate Claims  
       ↓
If valid → Return Payload  
If invalid → 401 Error

"""