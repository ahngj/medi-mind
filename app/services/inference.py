def temp_predict(file_path: str) -> dict:
    """
    [임시 함수]
    실제 모델이 연결되기 전까지 테스트용으로 사용하는 추론 함수입니다.
    
    Args:
        file_path (str): 저장된 음성 파일 경로

    Returns:
        dict: 추론된 클래스와 신뢰도를 포함한 응답
    """
    return {
        "status": "success",
        "message": "This is a TEMPORARY simulated inference result.",
        "prediction": "Normal",  # 예측 클래스 (임의 값)
        "confidence": 0.1                           # 임의의 신뢰도 점수
    }
