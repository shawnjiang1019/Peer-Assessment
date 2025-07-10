from fastapi import FastAPI
from datetime import datetime, timedelta
import asyncio
from typing import Optional, Any

class AppCache:
    def __init__(self, max_size: int = 1000):
        self._cache = {}
        self._access_times = {}
        self._max_size = max_size
    
    def get(self, key: str) -> Optional[Any]:
        if key in self._cache:
            value, expiry = self._cache[key]
            if datetime.now() < expiry:
                self._access_times[key] = datetime.now()
                return value
            else:
                self._evict(key)
        return None
    
    def set(self, key: str, value: Any, ttl_seconds: int = 300):
        if len(self._cache) >= self._max_size:
            self._evict_lru()
        
        expiry = datetime.now() + timedelta(seconds=ttl_seconds)
        self._cache[key] = (value, expiry)
        self._access_times[key] = datetime.now()
    
    def _evict(self, key: str):
        self._cache.pop(key, None)
        self._access_times.pop(key, None)
    
    def _evict_lru(self):
        if not self._access_times:
            return
        oldest_key = min(self._access_times.keys(), key=lambda k: self._access_times[k])
        self._evict(oldest_key)

# Global cache instance
cache = AppCache(max_size=5000)  

# EXAMPLE USAGE:
# @app.get("/users/{user_id}")
# async def get_user(user_id: int):
#     cache_key = f"user:{user_id}"
    
#     cached_user = cache.get(cache_key)
#     if cached_user:
#         return cached_user
    
#     # Fetch from database
#     user_data = await get_user_from_db(user_id)
    
#     # Cache for 10 minutes
#     cache.set(cache_key, user_data, ttl_seconds=600)
    
#     return user_data