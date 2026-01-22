import os
import shutil
import uuid
from typing import Dict, List
from pydub import AudioSegment

# 업로드 파일이 저장될 기본 경로 설정
UPLOAD_BASE = "backend/uploads"
# 메모리 상에서 세션 정보를 관리하기 위한 딕셔너리
SESSIONS: Dict[str, Dict] = {}

def create_user_session(name: str, age: int, gender: str, timestamp: str) -> str:
    """
    사용자 정보를 바탕으로 고유한 세션 ID와 저장 경로를 생성함
    """
    user_id = f"{name}_{age}_{gender}_{timestamp}"
    user_path = os.path.join(UPLOAD_BASE, user_id)
    
    # 물리적 디렉토리 생성
    os.makedirs(user_path, exist_ok=True)
    
    # 세션 관리 딕셔너리에 정보 등록
    SESSIONS[user_id] = {
        "path": user_path,
        "files": []
    }
    
    print(f"[세션] 유저 디렉토리 생성 완료: {user_path}")
    return user_id

def save_and_convert(file, user_id: str, file_content: bytes) -> str:
    """
    업로드된 파일을 저장하고 AI 분석이 가능한 WAV 포맷으로 변환함
    """
    if user_id not in SESSIONS:
        raise ValueError("유효하지 않은 세션 ID입니다.")

    user_path = SESSIONS[user_id]["path"]
    original_path = os.path.join(user_path, file.filename)

    # 전달받은 파일 바이너리 데이터를 물리 파일로 저장
    with open(original_path, "wb") as f:
        f.write(file_content)

    try:
        # 오디오 파일을 읽어 WAV 16kHz 포맷으로 변환
        audio = AudioSegment.from_file(original_path)
        wav_path = os.path.splitext(original_path)[0] + ".wav"
        
        # 모델 추론에 최적화된 코덱 및 샘플링 레이트 설정
        audio.export(
            wav_path, 
            format="wav", 
            parameters=["-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1"]
        )
        
        # 관리 리스트에 변환된 파일 경로 추가
        SESSIONS[user_id]["files"].append(wav_path)
        return wav_path
        
    except Exception as e:
        print(f"[오류] 오디오 변환 중 실패: {e}")
        raise e

def cleanup_user_session(user_id: str):
    """
    세션 종료 시 해당 사용자의 모든 임시 파일과 디렉토리를 삭제함
    """
    if user_id in SESSIONS:
        path = SESSIONS[user_id]["path"]
        # ignore_errors를 활성화하여 삭제 중 발생할 수 있는 사소한 에러 무시
        shutil.rmtree(path, ignore_errors=True)
        del SESSIONS[user_id]
        print(f"[세션] 자원 회수 및 데이터 삭제 완료: {user_id}")
