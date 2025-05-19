from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
import requests
import os

#set up bearer token authentication scheme, HTTPBearer() looks for tokens in the "Authoriation" header
security = HTTPBearer()

# extract the jwt from the header
async def validate_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials #get the raw token string from header
        # get keys
        jwks_url = f"https://{os.getenv('AUTH0_DOMAIN')}/.well-known/jwks.json" #JWKS (JSON Web Key Sets) rae a collection of public cryptographic keys used to verify JSON Web Tokens, Auth0 exposes these keys at this endpoint
        jwks = requests.get(jwks_url).json() # JSON object containing public keys from that endpoint
        
        header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == header["kid"]:
                rsa_key = {
                    "kty": key["kty"], # KEY TYPE
                    "kid": key["kid"], # KEY ID
                    "use": key["use"], # Usage
                    "n": key["n"],     # Modulus
                    "e": key["e"]      # Exponent
                }
                
        if not rsa_key:
            raise HTTPException(status_code=401, detail="Invalid token header")
            
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=["RS256"],
            audience=os.getenv("AUTH0_AUDIENCE"),
            issuer=f"https://{os.getenv('AUTH0_DOMAIN')}/"
        )
        return payload
    except JWTError as e:
        raise HTTPException(status_code=401, detail=str(e))
    

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