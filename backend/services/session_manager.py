import uuid
import os
import shutil
from fastapi import UploadFile
from pydub import AudioSegment

# 업로드 파일 저장 루트
UPLOAD_BASE = "backend/uploads"

def create_user_directory():
    user_id = str(uuid.uuid4())
    user_path = os.path.join(UPLOAD_BASE, user_id)
    os.makedirs(user_path, exist_ok=True)
    return user_id, user_path

async def save_uploaded_file(user_path: str, file: UploadFile):
    m4a_path = os.path.join(user_path, file.filename)
    with open(m4a_path, "wb") as buffer:
        buffer.write(await file.read())
    return m4a_path

def convert_to_wma(m4a_path: str) -> str:
    base_dir = os.path.dirname(m4a_path)
    base_name = os.path.splitext(os.path.basename(m4a_path))[0]
    wma_path = os.path.join(base_dir, base_name + ".wma")

    # 변환
    audio = AudioSegment.from_file(m4a_path, format="m4a")
    audio.export(wma_path, format="wma")

    return wma_path

def delete_user_directory(user_id: str):
    user_path = os.path.join(UPLOAD_BASE, user_id)
    if os.path.exists(user_path):
        shutil.rmtree(user_path)
        return True
    return False
