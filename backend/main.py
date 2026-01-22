from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routes import upload, predict
from model.inference import load_model # 모델 로딩 함수 임포트

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    [서버 수명 주기 관리]
    서버 시작 시 AI 모델을 미리 로드하여 첫 번째 요청의 지연 시간을 방지하고,
    서버 종료 시 필요한 정리 작업을 수행함
    """
    # 1. 서버 가동 시 모델 로드 (Singleton 패턴 적용)
    print("[시스템] 서버 가동 및 AI 모델 사전 로딩 중...")
    load_model() 
    
    yield # 서버가 실행 중인 상태
    
    # 2. 서버 종료 시 정리 로직이 필요하다면 여기에 작성
    print("[시스템] 서버 종료 및 자원 정리 중...")

# FastAPI 인스턴스 생성 및 lifespan 적용
app = FastAPI(lifespan=lifespan)

# CORS 설정: 프론트엔드(React Native 등)와의 원활한 통신을 위해 허용 범위 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # 실제 운영 시에는 특정 도메인으로 제한하는 것이 보안상 좋음
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록: 도메인별로 분리된 API 엔드포인트 연결
app.include_router(upload.router, prefix="/api/v1/upload", tags=["Upload & Session"])
app.include_router(predict.router, prefix="/api/v1/predict", tags=["Inference"])

@app.get("/")
def health_check():
    """
    서버의 상태를 확인하기 위한 기본 엔드포인트
    """
    return {"status": "online", "message": "FastAPI AI Inference Server is running"}
