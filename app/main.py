# FastAPI 클래스 import (앱 객체 생성용)
from fastapi import FastAPI

# routes.py 파일에서 만든 API 라우터 불러오기
from app.routes import router

# 세션 관리 API
from app.routes.session import router as session_router

# FastAPI 앱 인스턴스 생성
app = FastAPI(
    title="Medi Mind API",                        # Swagger 문서에 표시될 제목
    description="사용자의 음성 파일을 업로드받는 API",  # 문서에 표시될 설명
    version="0.1.0"                                # API 버전
)

# 라우터 등록 → /upload 같은 엔드포인트를 앱에 연결
app.include_router(router)

app.include_router(session_router)
