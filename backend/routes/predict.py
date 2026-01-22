import os
import shutil
import anyio # 동기 함수를 비동기 루프 내에서 안전하게 실행하기 위한 라이브러리
import aiofiles # 비동기 파일 읽기/쓰기를 지원하는 라이브러리
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status

# 프로젝트 내 모듈 참조
from services.session_manager import UPLOAD_BASE 
from model.inference import predict_audio
import soundfile as sf
from pydub import AudioSegment

router = APIRouter()

# CPU 사용량이 많은 오디오 가공 및 추론 로직을 별도 함수로 분리
def _process_audio_and_predict(file_path: str):
    """
    오디오 파일을 3GP/M4A에서 WAV로 변환하고 AI 모델 추론을 실행함
    """
    # 3GP/M4A 파일을 읽어와서 AI 모델용 16kHz WAV로 변환하여 내보냄
    audio = AudioSegment.from_file(file_path)
    wav_path = os.path.splitext(file_path)[0] + ".wav"
    
    audio.export(
        wav_path,
        format="wav",
        parameters=["-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1"]
    )
    
    # 변환된 WAV 파일을 읽어 Wav2Vec2 모델 추론 실행
    waveform, sample_rate = sf.read(wav_path, dtype="float32")
    result = predict_audio(waveform, sample_rate)
    
    return result

@router.post("/predict/")
async def predict(
    file: UploadFile = File(...),
    user_name: str = Form(...),
    user_age: int = Form(...),
    user_gender: str = Form(...)
):
    # 사용자 정보를 조합하여 임시 저장 디렉토리 경로 생성
    user_id = f"{user_name}_{user_age}_{user_gender}"
    user_dir = os.path.join(UPLOAD_BASE, user_id)
    os.makedirs(user_dir, exist_ok=True)
    
    file_path = os.path.join(user_dir, file.filename)

    try:
        # 비동기 방식으로 클라이언트가 보낸 파일을 디스크에 저장
        async with aiofiles.open(file_path, "wb") as f:
            content = await file.read()
            await f.write(content)

        # CPU 연산이 큰 변환/추론 로직을 워커 스레드로 보내 실행 (Non-blocking)
        prediction_result = await anyio.to_thread.run_sync(_process_audio_and_predict, file_path)

        return {
            "success": True,
            "user_id": user_id,
            "result": prediction_result
        }

    except Exception as e:
        print(f"[오류] {user_id}의 음성 분석 실패: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="서버에서 음성을 처리하는 중 오류가 발생했습니다."
        )

    finally:
        # 분석 완료 후 사용된 모든 임시 파일을 안전하게 삭제하여 서버 공간 확보
        if os.path.exists(user_dir):
            shutil.rmtree(user_dir, ignore_errors=True)
