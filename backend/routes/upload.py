from fastapi import APIRouter, UploadFile, File
from services.session_manager import (
    create_user_directory,
    save_uploaded_file,
    convert_to_wma
)

router = APIRouter()

@router.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    # 사용자 ID 및 디렉토리 생성
    user_id, user_path = create_user_directory()
    
    # m4a 파일 저장
    m4a_path = await save_uploaded_file(user_path, file)

    # wma로 변환
    try:
        wma_path = convert_to_wma(m4a_path)
    except Exception as e:
        return {"error": f"WMA 변환 실패: {str(e)}"}

    # 응답 반환
    return {
        "message": "업로드 및 변환 완료",
        "user_id": user_id,
        "m4a": m4a_path,
        "wma": wma_path
    }
