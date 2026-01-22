import os
import torch
import torchaudio
import numpy as np
from transformers import Wav2Vec2Processor, Wav2Vec2ForSequenceClassification

# 오디오 처리를 위한 백엔드 설정
torchaudio.set_audio_backend("soundfile")

# 모델 및 프로세서 전역 변수 (싱글톤 유지)
_processor = None
_model = None
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

def get_model():
    """
    서버 실행 중 모델 인스턴스를 단 하나만 유지하도록 관리 (Singleton)
    """
    global _processor, _model
    if _processor is None or _model is None:
        print(f"[시스템] AI 모델 로딩 시도: {MODEL_DIR}")
        _processor = Wav2Vec2Processor.from_pretrained(MODEL_DIR)
        _model = Wav2Vec2ForSequenceClassification.from_pretrained(MODEL_DIR)
        _model.eval() # 추론 전용 모드로 전환
        print("[시스템] AI 모델이 메모리에 성공적으로 로드되었습니다.")
    return _processor, _model

def predict_audio(waveform: torch.Tensor, sample_rate: int) -> dict:
    """
    입력된 음성 데이터를 기반으로 상태 예측 수행
    """
    processor, model = get_model()

    # 모델 규격(16kHz)에 맞게 샘플링 레이트 조정
    if sample_rate != 16000:
        resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
        waveform = resampler(waveform)

    # Tensor 데이터를 추론을 위한 numpy 형식으로 변환
    if isinstance(waveform, torch.Tensor):
        waveform = waveform.squeeze().numpy()

    # 전처리기 실행 및 텐서 변환
    inputs = processor(waveform, sampling_rate=16000, return_tensors="pt", padding=True)

    # 추론 시 그래디언트 계산을 비활성화하여 성능 최적화
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        # 결과값을 확률분포(Softmax)로 변환
        probs = torch.softmax(logits, dim=-1).squeeze()

    # 최상위 확률 클래스 및 확률 리스트 반환
    return {
        "class": int(torch.argmax(probs)),
        "probabilities": probs.tolist()
    }
