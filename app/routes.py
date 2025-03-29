# FastAPI의 APIRouter를 사용하여 라우터(엔드포인트)를 분리 관리
from fastapi import APIRouter, UploadFile, File
import os

# 라우터 객체 생성 - 이 객체에 경로를 등록한 뒤 main.py에서 include_router로 등록함
router = APIRouter()

# 파일이 저장될 디렉토리 경로 설정
UPLOAD_DIR = "static/uploads"

# 디렉토리가 없을 경우 자동으로 생성
os.makedirs(UPLOAD_DIR, exist_ok=True)


# [POST] /upload 엔드포인트 정의
# 사용자가 파일을 보낼 때 'file' 필드로 업로드
@router.post("/upload")
async def upload_audio(file: UploadFile = File(...)):
    # 업로드된 파일의 저장 경로 구성
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # 파일 내용을 비동기적으로 읽고 저장
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # 업로드 성공 메시지 반환 (JSON)
    return {"message": f"{file.filename} uploaded successfully"}
