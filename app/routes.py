from fastapi import APIRouter, UploadFile, File
import os
import uuid
from app.services.inference import temp_predict  # 함수 이름 변경

router = APIRouter()

UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/predict")
async def predict_audio(file: UploadFile = File(...)):
    """
    사용자가 보낸 음성 파일을 서버에 저장한 뒤,
    임시 추론 함수(temp_predict)를 호출하여 결과 반환.
    """
    # UUID를 붙인 고유한 파일 이름 생성
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # 파일 저장
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # 임시 추론 함수 호출 (모델 없이 시뮬레이션)
    result = temp_predict(file_path)

    return result
