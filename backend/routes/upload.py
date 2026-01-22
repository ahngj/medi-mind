import anyio
import aiofiles
from fastapi import APIRouter, UploadFile, Form, status, HTTPException
from fastapi.responses import JSONResponse
from services.session_manager import create_user_session, save_and_convert

router = APIRouter()

@router.post("/start-session")
async def start_session(
    name: str = Form(...), 
    age: int = Form(...), 
    gender: str = Form(...), 
    timestamp: str = Form(...)
):
    # 사용자의 기본 세션 정보를 생성하고 고유 ID 반환
    user_id = create_user_session(name, age, gender, timestamp)
    return {"user_id": user_id}

@router.post("/upload")
async def upload_file(file: UploadFile, user_id: str = Form(...)):
    """
    파일 업로드와 오디오 변환을 비동기 방식으로 안전하게 처리함
    """
    try:
        # 파일 내용을 비동기로 읽어옴
        file_content = await file.read()
        
        # 동기적으로 작동하는 파일 저장 및 변환 로직(save_and_convert)을 별도 스레드에서 실행
        # 이는 pydub 변환 중 서버가 멈추는 현상을 방지함
        await anyio.to_thread.run_sync(save_and_convert, file, user_id, file_content)
        
        return JSONResponse(
            content={"message": "업로드 및 변환 성공", "user_id": user_id}
        )
    except ValueError as ve:
        # 잘못된 user_id 등 논리적 오류 처리
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        # 예기치 못한 서버 내부 오류 처리
        return JSONResponse(
            content={"error": f"파일 처리 실패: {str(e)}"}, 
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
