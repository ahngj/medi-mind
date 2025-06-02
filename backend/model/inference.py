<<<<<<< HEAD
import os
import torch
import torchaudio
import numpy as np
from transformers import Wav2Vec2Processor, Wav2Vec2ForSequenceClassification

# 🧠 백엔드 설정
torchaudio.set_audio_backend("soundfile")

# 📂 모델 디렉토리 경로
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

# ⬇️ 모델 및 전처리기 로딩
processor = Wav2Vec2Processor.from_pretrained(MODEL_DIR)
model = Wav2Vec2ForSequenceClassification.from_pretrained(MODEL_DIR)
model.eval()

NUM_CLASSES = model.config.num_labels  # 보통 2개 (정상, 비정상)

def predict_audio(waveform: torch.Tensor, sample_rate: int) -> dict:
    print(f"[🧠] 예측 시작 - waveform.shape={waveform.shape}, sample_rate={sample_rate}")

    # 리샘플링 (16kHz 맞춤)
    if sample_rate != 16000:
        resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
        waveform = resampler(waveform)

    # numpy로 변환
    if isinstance(waveform, torch.Tensor):
        waveform = waveform.squeeze().numpy()

    # 전처리
    inputs = processor(waveform, sampling_rate=16000, return_tensors="pt", padding=True)

    # 예측
    with torch.no_grad():
        logits = model(**inputs).logits
        probs = torch.softmax(logits, dim=-1).squeeze()

    predicted_class = int(torch.argmax(probs))
    return {
        "class": predicted_class,
        "probabilities": probs.tolist()
    }

def predict_average(file_paths: list[str]) -> dict:
    print(f"[📊] 총 {len(file_paths)}개 파일 평균 예측 시작")
    all_probs = []

    for path in file_paths:
        try:
            waveform, sample_rate = torchaudio.load(path)
            result = predict_audio(waveform, sample_rate)
            all_probs.append(result["probabilities"])
            print(f"[✅] {os.path.basename(path)} → {result}")
        except Exception as e:
            print(f"[❌] 예측 실패 - {path}: {e}")

    if not all_probs:
        return {"error": "예측 가능한 파일이 없습니다."}

    avg_probs = torch.tensor(all_probs).mean(dim=0)
    final_class = int(torch.argmax(avg_probs))

    return {
        "average_probabilities": avg_probs.tolist(),
        "predicted_class": final_class
    }
=======
from transformers import AutoProcessor, AutoModelForSequenceClassification
import torchaudio
import torch

MODEL_DIR = "backend/model"  # 모델 파일들이 저장된 경로

# 모델 및 전처리기 불러오기
processor = AutoProcessor.from_pretrained(MODEL_DIR)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
model.eval()

def predict_audio(wav_path: str) -> int:
    waveform, sample_rate = torchaudio.load(wav_path)
    inputs = processor(
        waveform.squeeze().numpy(),
        sampling_rate=sample_rate,
        return_tensors="pt",
        padding=True
    )
    with torch.no_grad():
        logits = model(**inputs).logits
        prediction = torch.argmax(logits, dim=-1).item()
    return prediction
>>>>>>> 57a5bf9f8c14016fc41945ad1ba65cfb2e7542c3
