# main.py
from fastapi import FastAPI
from routes import upload, predict

app = FastAPI()
<<<<<<< HEAD
app.include_router(upload.router)
=======

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

>>>>>>> 57a5bf9f8c14016fc41945ad1ba65cfb2e7542c3
app.include_router(predict.router)
