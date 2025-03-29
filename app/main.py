from fastapi import FastAPI
from app.routes import router

app = FastAPI(
    title="Medi Mind API",
    description="사용자의 음성 파일을 업로드받는 API",
    version="0.1.0"
)

# API 라우터 등록
app.include_router(router)
