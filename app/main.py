from fastapi import FastAPI
from app.routes import predict_router, session_router

app = FastAPI()

app.include_router(predict_router)
app.include_router(session_router)
