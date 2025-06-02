# routes/upload.py
from fastapi import APIRouter, UploadFile, Form
from fastapi.responses import JSONResponse
from services.session_manager import create_user_session, save_and_convert

router = APIRouter()

@router.post("/start-session")
def start_session(name: str = Form(...), age: int = Form(...), gender: str = Form(...), timestamp: str = Form(...)):
    user_id = create_user_session(name, age, gender, timestamp)
    return {"user_id": user_id}

@router.post("/upload")
def upload_file(file: UploadFile, user_id: str = Form(...)):
    try:
        save_and_convert(file, user_id)
        return JSONResponse(content={"message": "Upload & convert success", "user_id": user_id})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
