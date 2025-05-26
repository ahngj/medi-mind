from fastapi import APIRouter, UploadFile, File
from backend.inference import predict_audio
from backend.services.session_manager import (
    create_user_directory,
    save_uploaded_file,
    convert_to_wav,
    delete_user_directory
)

router = APIRouter()

@router.post("/predict/")
async def predict(file: UploadFile = File(...)):
    user_id, user_path = create_user_directory()
    m4a_path = await save_uploaded_file(user_path, file)

    try:
        wav_path = convert_to_wav(m4a_path)
        prediction = predict_audio(wav_path)
    except Exception as e:
        delete_user_directory(user_id)
        return {"error": f"처리 중 오류 발생: {str(e)}"}

    delete_user_directory(user_id)
    return {
        "user_id": user_id,
        "prediction": prediction
    }
