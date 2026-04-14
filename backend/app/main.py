from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, parties, items

app = FastAPI(title="Potluck Party API", version="1.0.0")

# CORS設定（フロントエンドからのアクセスを許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーター登録
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(parties.router, prefix="/api/parties", tags=["parties"])
app.include_router(items.router, prefix="/api/parties", tags=["items"])


@app.get("/", tags=["health"])
def health_check():
    return {"status": "ok", "message": "Potluck Party API is running"}
