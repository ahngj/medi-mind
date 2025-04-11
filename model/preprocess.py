import torchaudio
from config import SAMPLE_RATE
from transformers import Wav2Vec2Processor

processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base")

def preprocess_function(batch):
    speech_array, sampling_rate = torchaudio.load(batch["path"])
    
    # Resample to 16kHz if needed
    if sampling_rate != SAMPLE_RATE:
        speech_array = torchaudio.functional.resample(
            speech_array, orig_freq=sampling_rate, new_freq=SAMPLE_RATE
        )
    # processor expects mono, 1D array
    input_values = processor(speech_array[0], sampling_rate=SAMPLE_RATE).input_values[0]

    return {
        "input_values": input_values,
        "label": batch["label"]
    }
