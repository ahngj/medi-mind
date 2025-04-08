# app/routes.py

# FastAPI에서 API 라우팅 기능을 위한 클래스와 파일 업로드 처리 도구 가져오기
from fastapi import APIRouter, UploadFile, File, HTTPException
import os          # 파일 경로 생성 등을 위한 파이썬 기본 라이브러리
import uuid        # 파일 이름 중복 방지를 위한 고유 식별자 생성

# 현재는 모델이 없으므로 임시로 추론 결과를 반환하는 함수
from app.services.inference import temp_predict

# 라우터 객체 생성: 이 안에 API 엔드포인트를 정의함
router = APIRouter()

# 파일을 저장할 기본 폴더 경로 설정
UPLOAD_BASE_DIR = "static/uploads"
os.makedirs(UPLOAD_BASE_DIR, exist_ok=True)  # 최상위 업로드 폴더가 없으면 생성

# 허용 확장자 및 최대 파일 크기 (10MB)
ALLOWED_EXTENSIONS = {".wav"}
MAX_FILE_SIZE_MB = 10

# 확장자 유효성 검사 함수
def is_allowed_file(filename: str) -> bool:
    return os.path.splitext(filename)[1].lower() in ALLOWED_EXTENSIONS

# /predict API 정의 - 사용자가 음성 파일을 전송하면 추론 결과를 반환
@router.post("/predict")
async def predict_audio(file: UploadFile = File(...), user_id: str = "default") -> dict:
    """
    사용자가 업로드한 파일을 서버에 저장하고,
    임시 추론 결과(temp_predict)를 반환하는 API

    Args:
        file (UploadFile): 업로드된 음성 파일 (.wav)
        user_id (str): 사용자 ID - 접속 시 발급받은 ID

    Returns:
        dict: 추론 결과 JSON (label, confidence 등 포함)
    """

    # 1. 확장자 검사
    if not is_allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="Only .wav files are allowed.")

    # 2. 용량 검사
    content = await file.read()
    if len(content) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB allowed.")

    # 3. 사용자 전용 디렉토리 설정 (예: static/uploads/user_1/)
    user_dir = os.path.join(UPLOAD_BASE_DIR, user_id)
    os.makedirs(user_dir, exist_ok=True)

    # 4. UUID 기반 파일명 생성 및 저장 경로 설정
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(user_dir, filename)

    # 5. 파일 저장
    with open(file_path, "wb") as f:
        f.write(content)

    # 6. 임시 추론 함수 호출 (모델 연동 전까지는 temp_predict 사용)
    result = temp_predict(file_path)

    # 7. 응답 JSON 반환 (프론트 친화적인 형식)
    return {
        "status": "success",
        "result": {
            "label": result["prediction"],
            "confidence": result["confidence"]
        },
        "message": result["message"]
    }
