# FastAPI에서 API 라우팅 기능을 위한 클래스와 파일 업로드 처리 도구 가져오기
from fastapi import APIRouter, UploadFile, File
import os          # 파일 경로 생성 등을 위한 파이썬 기본 라이브러리
import uuid        # 파일 이름 중복 방지를 위한 고유 식별자 생성

# 현재는 모델이 없으므로 임시로 추론 결과를 반환하는 함수
from app.services.inference import temp_predict

# 라우터 객체 생성: 이 안에 API 엔드포인트를 정의함
router = APIRouter()

# 파일을 저장할 폴더 경로 설정
UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # 폴더가 없으면 생성

# /predict API 정의 - 사용자가 음성 파일을 전송하면 추론 결과를 반환
@router.post("/predict")
async def predict_audio(file: UploadFile = File(...)):
    """
    사용자가 업로드한 파일을 서버에 저장하고,
    임시 추론 결과(temp_predict)를 반환하는 API
    """

    # UUID를 붙여서 저장할 고유 파일 이름 생성
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # 파일 저장 (비동기 방식)
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # 임시 추론 함수 호출 (나중에 실제 모델로 교체)
    result = temp_predict(file_path)

    # JSON 형태로 결과 반환
    return result
