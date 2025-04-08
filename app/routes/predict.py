# app/routes/predict.py

from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import uuid
from app.services.inference import temp_predict

router = APIRouter()

UPLOAD_BASE_DIR = "static/uploads"
os.makedirs(UPLOAD_BASE_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".wav"}
MAX_FILE_SIZE_MB = 10

def is_allowed_file(filename: str) -> bool:
    return os.path.splitext(filename)[1].lower() in ALLOWED_EXTENSIONS

@router.post("/predict")
async def predict_audio(file: UploadFile = File(...), user_id: str = "default") -> dict:
    if not is_allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="Only .wav files are allowed.")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB allowed.")

    user_dir = os.path.join(UPLOAD_BASE_DIR, user_id)
    os.makedirs(user_dir, exist_ok=True)

    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(user_dir, filename)

    with open(file_path, "wb") as f:
        f.write(content)

    result = temp_predict(file_path)

    return {
        "status": "success",
        "result": {
            "label": result["prediction"],
            "confidence": result["confidence"]
        },
        "message": result["message"]
    }
