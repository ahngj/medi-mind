from fastapi import FastAPI
from app.routes import predict_router, session_router

app = FastAPI(
    title="Medi-Mind",
    description="사용자의 음성 데이터를 기반으로 인지기능 상태를 분석",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(predict_router)
app.include_router(session_router)
