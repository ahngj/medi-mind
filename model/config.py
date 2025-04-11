MODEL_NAME = "facebook/wav2vec2-base"
OUTPUT_DIR = "./checkpoints"
TRAIN_DATA_DIR = "./data/train"  # .wav 파일들이 저장된 경로

SAMPLE_RATE = 16000
NUM_LABELS = 2  # 클래스 0/1 이지만 실제로는 label=1만 사용

EPOCHS = 5
BATCH_SIZE = 8
LOGGING_STEPS = 10
SAVE_STEPS = 100
USE_FP16 = True
