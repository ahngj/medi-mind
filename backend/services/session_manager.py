# services/session_manager.py
import os
import uuid
import shutil
from typing import Dict, List
from fastapi import UploadFile
from pydub import AudioSegment

UPLOAD_BASE = "backend/uploads"
SESSIONS: Dict[str, Dict] = {}

def create_user_session(name: str, age: int, gender: str, timestamp: str) -> str:
    user_id = f"{name}_{age}_{gender}_{timestamp}"
    user_path = os.path.join(UPLOAD_BASE, user_id)
    os.makedirs(user_path, exist_ok=True)
    SESSIONS[user_id] = {"path": user_path, "files": []}
    print(f"[📁] 유저 디렉토리 생성: {user_path}")
    return user_id

def save_and_convert(file: UploadFile, user_id: str) -> str:
    if user_id not in SESSIONS:
        raise ValueError("Invalid user_id")

    user_path = SESSIONS[user_id]["path"]
    original_path = os.path.join(user_path, file.filename)
    with open(original_path, "wb") as f:
        f.write(file.file.read())
    print(f"[📥] 파일 저장 완료: {original_path}")

    try:
        audio = AudioSegment.from_file(original_path, format="3gp")
        wav_path = original_path.rsplit(".", 1)[0] + ".wav"
        audio.export(wav_path, format="wav", parameters=["-acodec", "pcm_s16le"])
        print(f"[🔄] wav 변환 완료: {wav_path}")
        SESSIONS[user_id]["files"].append(wav_path)
        return wav_path
    except Exception as e:
        print(f"[❌] 변환 오류: {e}")
        raise

def get_session_files(user_id: str) -> List[str]:
    if user_id not in SESSIONS:
        raise ValueError("Invalid user_id")
    return SESSIONS[user_id]["files"]

def cleanup_user_session(user_id: str):
    if user_id in SESSIONS:
        shutil.rmtree(SESSIONS[user_id]["path"], ignore_errors=True)
        del SESSIONS[user_id]
        print(f"[🧹] 디렉토리 삭제: {user_id}")
