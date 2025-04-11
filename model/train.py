from transformers import (
    Wav2Vec2ForSequenceClassification,
    TrainingArguments,
    Trainer
)
from preprocess import preprocess_function
from dataset import load_dataset
from config import *

from transformers import Wav2Vec2Processor
import torch

# Load dataset
dataset = load_dataset(TRAIN_DATA_DIR)
dataset = dataset.map(preprocess_function)

# Load processor and model
processor = Wav2Vec2Processor.from_pretrained(MODEL_NAME)
model = Wav2Vec2ForSequenceClassification.from_pretrained(
    MODEL_NAME,
    num_labels=NUM_LABELS
)

# Define training args
training_args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    per_device_train_batch_size=BATCH_SIZE,
    num_train_epochs=EPOCHS,
    logging_steps=LOGGING_STEPS,
    save_steps=SAVE_STEPS,
    evaluation_strategy="no",
    fp16=USE_FP16
)

# Define trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
    tokenizer=processor,
)

# Train
trainer.train()

# Save final model
model.save_pretrained(OUTPUT_DIR)
processor.save_pretrained(OUTPUT_DIR)
