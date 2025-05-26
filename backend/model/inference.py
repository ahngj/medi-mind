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
