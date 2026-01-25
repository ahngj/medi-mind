# 🧠 Medi-Mind

의료 음성 데이터를 기반으로 **AI 추론을 수행하는 백엔드 중심 서비스**입니다.
FastAPI 서버에서 음성 파일 업로드 → 전처리(포맷 변환) → Wav2Vec2 기반 모델 추론 → 결과 반환까지의 전체 파이프라인을 담당합니다.

---

## 🔍 프로젝트 한 줄 요약

> **모바일/웹 클라이언트에서 수집한 음성 데이터를 서버에서 AI 모델로 분석하여 의료적 판단을 돕는 백엔드 시스템**

---

## 🏗️ 전체 아키텍처

```
[ Client (Mobile / Web) ]
          |
          |  multipart/form-data
          v
[ FastAPI Backend ]
          |
   ┌───────────────┐
   │ Upload / API  │  ← FastAPI Router
   └───────────────┘
          |
   ┌───────────────┐
   │ Audio Handler │  ← 파일 저장 / 포맷 변환
   └───────────────┘
          |
   ┌───────────────┐
   │ AI Inference  │  ← Wav2Vec2
   └───────────────┘
          |
       JSON Response
```

---

## 📁 백엔드 디렉터리 구조

```
backend/
 ├── main.py                # FastAPI 엔트리 포인트
 ├── routes/                # API 라우터
 │   ├── upload.py          # 세션 생성 및 파일 업로드
 │   └── predict.py         # 음성 예측 API
 ├── services/
 │   └── session_manager.py # 사용자 세션 / 파일 관리
 └── model/
     ├── inference.py       # AI 모델 추론 로직
     ├── model.safetensors  # 학습된 모델 가중치
     └── config.json 등     # HuggingFace 모델 설정
```

---

## 🔄 핵심 로직 플로우 (Backend Logic Diagram)

```
[Client]
   |
   |  음성 파일 + 사용자 정보
   v
POST /predict/
   |
   v
[Router]
   |
   v
[파일 저장]
   |
   v
[3GP → WAV 변환]
   |
   v
[AI 모델 추론]
   |
   v
[JSON 결과 반환]
```

---

## 🎧 음성 처리 파이프라인

1. **음성 업로드**

   * multipart/form-data 형식
   * 사용자 정보(name, age, gender)와 함께 전송

2. **파일 관리**

   * 사용자별 임시 디렉터리 생성
   * 요청 종료 시 자동 정리

3. **포맷 변환**

   * 3GP → WAV
   * PCM 16bit / 16kHz / Mono

4. **AI 추론**

   * Wav2Vec2ForSequenceClassification
   * softmax 확률 기반 결과 반환

---

## 🤖 AI 모델 추론 구조

* Framework: **PyTorch + HuggingFace Transformers**
* Model: **Wav2Vec2ForSequenceClassification**
* 입력: 16kHz mono waveform
* 출력:

```json
{
  "class": 1,
  "probabilities": [0.12, 0.88]
}
```

---

## 📡 API 명세 (요약)

### POST `/predict/`

**Request**

* file: 음성 파일 (3gp)
* user_name: string
* user_age: number
* user_gender: string

**Response**

```json
{
  "result": {
    "class": 0,
    "probabilities": [0.73, 0.27]
  }
}
```
## ⚠️ 현재 상태 및 개선 포인트

* 일부 파일에 **merge conflict 코드 존재** → 정리 필요
* 세션 관리 로직을 Redis 등 외부 스토어로 확장 가능
* Swagger(OpenAPI) 문서 자동화 가능
* 추론 결과 후처리(임계값, 해석 레이어) 확장 여지 있음

---

## 🎯 백엔드 관점에서의 핵심 포인트

* 음성 데이터 처리 + AI 추론을 **단일 요청 라이프사이클**로 안정적으로 처리
* 대용량 모델을 서버 로딩 시 1회만 메모리에 적재
* 사용자별 임시 파일 격리 및 자동 정리 구조

---

## 💡 더 확장해볼 질문

**Q1. 이 백엔드를 실제 서비스로 배포한다면, 동시 요청 처리 구조는 어떻게 바꾸는 게 좋을까?**
**Q2. 음성 추론 결과를 의료적으로 해석하기 위한 레이어는 어디에 두는 게 적절할까?**
**Q3. 현재 구조에서 비동기 처리 또는 큐 기반 구조로 확장한다면 어떤 지점이 병목이 될까?**
