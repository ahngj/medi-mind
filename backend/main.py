from fastapi import FastAPI
from routes import upload, predict

app = FastAPI()
app.include_router(upload.router)
=======

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(predict.router)
