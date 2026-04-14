import uuid
from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends

from app.core.database import db
from app.core.auth import get_current_user
from app.models.party import PartyCreate, PartyUpdate, JoinRequest

router = APIRouter()


def require_owner(party_id: str, current_user=Depends(get_current_user)):
    """主催者チェックのヘルパー関数"""
    party = db.parties.find_one({"_id": party_id})
    if not party:
        raise HTTPException(status_code=404, detail="パーティーが見つかりません")
    if party["owner_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="主催者のみ実行できます")
    return party


@router.get("/", summary="参加パーティー一覧取得")
def list_parties(current_user=Depends(get_current_user)):
    uid = str(current_user["_id"])
    parties = list(db.parties.find({"members": uid}))
    result = []
    for p in parties:
        result.append({
            **p,
            "id": str(p["_id"]),
            "role": "owner" if p["owner_id"] == uid else "member",
        })
    return result


@router.post("/", summary="パーティー作成")
def create_party(party: PartyCreate, current_user=Depends(get_current_user)):
    new_party = {
        "title": party.title,
        "date": party.date,
        "memo": party.memo,
        "owner_id": str(current_user["_id"]),
        "invite_token": str(uuid.uuid4()),  # 招待トークンを自動生成
        "members": [str(current_user["_id"])],
        "created_at": datetime.utcnow().isoformat(),
    }
    result = db.parties.insert_one(new_party)
    return {"id": str(result.inserted_id), **new_party}


@router.get("/{party_id}", summary="パーティー詳細取得")
def get_party(party_id: str, current_user=Depends(get_current_user)):
    party = db.parties.find_one({"_id": party_id})
    if not party:
        raise HTTPException(status_code=404, detail="パーティーが見つかりません")
    uid = str(current_user["_id"])
    if uid not in party["members"]:
        raise HTTPException(status_code=403, detail="このパーティーへのアクセス権がありません")
    return {**party, "id": str(party["_id"])}


@router.patch("/{party_id}", summary="パーティー情報更新（主催者のみ）")
def update_party(party_id: str, body: PartyUpdate, current_user=Depends(get_current_user)):
    require_owner(party_id, current_user)
    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    db.parties.update_one({"_id": party_id}, {"$set": update_data})
    return {"message": "更新しました"}


@router.delete("/{party_id}", summary="パーティー削除（主催者のみ）")
def delete_party(party_id: str, current_user=Depends(get_current_user)):
    require_owner(party_id, current_user)
    db.parties.delete_one({"_id": party_id})
    db.items.delete_many({"party_id": party_id})
    return {"message": "削除しました"}


@router.post("/{party_id}/join", summary="招待トークンでパーティー参加")
def join_party(party_id: str, token_body: JoinRequest, current_user=Depends(get_current_user)):
    party = db.parties.find_one({"invite_token": token_body.invite_token, "_id": party_id})
    if not party:
        raise HTTPException(status_code=404, detail="パーティーが見つかりません")
    user_id = str(current_user["_id"])
    if user_id in party["members"]:
        raise HTTPException(status_code=409, detail="すでに参加済みです")
    db.parties.update_one({"_id": party_id}, {"$push": {"members": user_id}})
    return {"message": "参加成功", "party_id": party_id}
