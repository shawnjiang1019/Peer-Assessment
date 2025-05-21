from functools import lru_cache
import os
from dotenv import load_dotenv, dotenv_values 
from pydantic_settings import BaseSettings

load_dotenv() 

class Settings(BaseSettings):
    auth0_domain: str = os.getenv("AUTH0_DOMAIN")
    auth0_api_audience: str = os.getenv("AUTH0_API_AUDIENCE")
    auth0_issuer: str = os.getenv("AUTH0_ISSUER")
    auth0_algorithms: str = os.getenv("AUTH0_ALGORITHMS")

    class Config:
        env_file = ".env"


