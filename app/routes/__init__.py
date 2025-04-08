# app/routes/__init__.py

from .predict import router as predict_router
from .session import router as session_router

__all__ = ["predict_router", "session_router"]
