# main.py
from fastapi import FastAPI
from routes import upload, predict

app = FastAPI()
app.include_router(upload.router)
app.include_router(predict.router)
