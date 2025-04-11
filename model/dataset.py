import os
from datasets import Dataset

def load_dataset(data_dir):
    data = []
    for fname in os.listdir(data_dir):
        if fname.endswith(".wav"):
            data.append({
                "path": os.path.join(data_dir, fname),
                "label": 1  # 모든 데이터는 치매 환자 클래스
            })
    return Dataset.from_list(data)
