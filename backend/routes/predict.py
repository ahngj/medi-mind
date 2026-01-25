from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
import os
import shutil
from pydub import AudioSegment
import soundfile as sf  # torchaudio 대신 사용
from model.inference import predict_audio

router = APIRouter()

UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/predict/")
async def predict(
    file: UploadFile = File(...),
    user_name: str = Form(...),
    user_age: int = Form(...),
    user_gender: str = Form(...),
    meta: str = Form(None)
):
    try:
        print(f"📨 수신된 Form 데이터: {{"
              f"'user_name': '{user_name}', 'meta': '{meta}', "
              f"'user_age': '{user_age}', 'user_gender': '{user_gender}', "
              f"'file': {file}}}")

        # 유저 디렉토리 생성
        user_id = f"{user_name}_{user_age}_{user_gender}"
        user_dir = os.path.join(UPLOAD_DIR, user_id)
        os.makedirs(user_dir, exist_ok=True)
        print(f"[📁] 유저 디렉토리 생성: {user_dir}")

        # 파일 저장
        file_path = os.path.join(user_dir, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        print(f"[📥] 파일 저장 완료: {file_path}")

        # 3GP → WAV 변환
        try:
            audio = AudioSegment.from_file(file_path, format="3gp")
            wav_path = os.path.splitext(file_path)[0] + ".wav"

            # ✅ 명확하게 PCM 16bit, 16kHz, 모노 채널 설정
            audio.export(
                wav_path,
                format="wav",
                parameters=["-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1"]
            )
            print(f"[🔄] wav 변환 완료: {wav_path}")
        except Exception as e:
            print(f"[❌] 변환 오류: {e}")
            return JSONResponse(status_code=500, content={"error": "WAV 변환 실패"})

        # 예측 수행
        try:
            waveform, sample_rate = sf.read(wav_path, dtype="float32")
            result = predict_audio(waveform, sample_rate)
            print(f"[✅] 예측 완료: {wav_path} → {result}")
            return {"result": result}
        except Exception as e:
            print(f"[❌] 예측 중 오류: {e}")
            return JSONResponse(status_code=500, content={"error": str(e)})

    finally:
        if os.path.exists(user_dir):
            shutil.rmtree(user_dir)
            print(f"[🧹] 디렉토리 삭제: {user_dir}")
=======
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
