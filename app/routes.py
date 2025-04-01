# FastAPI의 주요 도구 import
from fastapi import APIRouter, UploadFile, File, HTTPException

# 파일 시스템 관련 표준 라이브러리 import
import os

# 파일 이름 충돌 방지를 위한 고유 식별자 생성용
import uuid

# 타입 힌팅용 (Literal은 현재 코드에선 사용되지 않음, 삭제 가능)
from typing import Literal

# 현재는 임시 모델이므로, 실제 추론 대신 사용하는 더미 추론 함수
from app.services.inference import temp_predict

# FastAPI 라우터 객체 생성 - /predict 같은 경로를 이 객체에 등록
router = APIRouter()

# 저장할 기본 폴더 경로 설정
UPLOAD_DIR = "static/uploads"

# uploads 폴더가 없으면 자동으로 생성
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 허용할 파일 확장자 목록 및 최대 허용 크기 (10MB)
ALLOWED_EXTENSIONS = {".wav"}
MAX_FILE_SIZE_MB = 10

# 업로드된 파일의 확장자를 검사하는 함수
def is_allowed_file(filename: str) -> bool:
    """파일 이름에서 확장자를 추출해 .wav 형식만 허용"""
    return os.path.splitext(filename)[1].lower() in ALLOWED_EXTENSIONS


# /predict 경로에 POST 요청이 들어오면 실행될 API 함수
@router.post("/predict")
async def predict_audio(file: UploadFile = File(...), user_id: str = "default") -> dict:
    """
    사용자로부터 음성 파일을 업로드받아 저장하고,
    추론 결과(현재는 temp_predict로 더미 결과)를 반환하는 API 엔드포인트

    Args:
        file (UploadFile): 업로드된 음성 파일 (.wav)
        user_id (str): 파일을 저장할 사용자 식별자 디렉토리 (기본값: 'default')

    Returns:
        dict: 추론 결과(label, confidence), 메시지, 상태코드를 포함한 JSON 응답
    """

    # 1. 확장자 검사: .wav 외의 파일은 거부
    if not is_allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="Only .wav files are allowed.")

    # 2. 용량 검사: 10MB 초과 파일은 거부
    content = await file.read()  # 파일 내용을 비동기 방식으로 읽음
    if len(content) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB allowed.")
    
    # 3. 사용자별 디렉토리 생성 (예: static/uploads/user123/)
    user_dir = os.path.join(UPLOAD_DIR, user_id)
    os.makedirs(user_dir, exist_ok=True)

    # 4. UUID를 포함한 고유한 파일명 생성
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(user_dir, filename)

    # 5. 파일 저장
    with open(file_path, "wb") as f:
        f.write(content)

    # 6. 현재는 임시 추론 함수 호출 (모델 연동 전 단계)
    result = temp_predict(file_path)

    # 7. 최종 응답 포맷을 JSON으로 정리해 반환
    return {
        "status": "success",  # 요청 처리 성공 여부
        "result": {
            "label": result["prediction"],     # 예측된 클래스
            "confidence": result["confidence"]  # 예측 신뢰도 (0~1)
        },
        "message": result["message"]  # 추가 메시지 (예: 설명 또는 상태)
    }
