# app/routes/session.py

from fastapi import APIRouter, HTTPException
from app.services.session_manager import SessionManager

router = APIRouter()
session_manager = SessionManager()

@router.post("/connect")
def connect():
    user_id = session_manager.generate_id()
    return {"user_id": user_id, "message": "Connected successfully."}

@router.post("/disconnect")
def disconnect(user_id: str):
    success = session_manager.release_id(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User ID not found or not active.")
    return {"message": f"User '{user_id}' disconnected and data cleaned up."}
