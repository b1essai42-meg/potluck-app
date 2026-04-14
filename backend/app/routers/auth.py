from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends

from app.core.database import db
from app.core.auth import hash_password, verify_password, create_access_token, get_current_user
from app.models.user import UserCreate, UserLogin, UserUpdate

router = APIRouter()


@router.post(
    "/register",
    summary="新規ユーザー登録",
    description="メールアドレスとパスワードで新規登録する。メールは一意制。",
    responses={400: {"description": "メール重複"}},
)
def register(user: UserCreate):
    # 1. メール重複チェック
    if db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="このメールアドレスはすでに登録されています")
    # 2. パスワードをハッシュ化
    hashed = hash_password(user.password)
    # 3. MongoDB に保存
    result = db.users.insert_one({
        "email": user.email,
        "password_hash": hashed,
        "display_name": user.display_name,
        "created_at": datetime.utcnow(),
    })
    return {"id": str(result.inserted_id), "email": user.email}


@router.post("/login", summary="ログイン", description="メールアドレスとパスワードで認証し JWT を返す。")
def login(credentials: UserLogin):
    user = db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=401,
            detail="メールアドレスまたはパスワードが正しくありません",
        )
    token = create_access_token({"sub": str(user["_id"])})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", summary="現在のユーザー情報取得")
def get_me(current_user=Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "email": current_user["email"],
        "display_name": current_user.get("display_name", ""),
    }


@router.patch("/users/me", summary="プロフィール更新")
def update_me(body: UserUpdate, current_user=Depends(get_current_user)):
    db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"display_name": body.display_name}},
    )
    return {"message": "更新しました"}
