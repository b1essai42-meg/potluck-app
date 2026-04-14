from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends

from app.core.database import db
from app.core.auth import get_current_user
from app.models.item import ItemCreate, ItemUpdate, StatusUpdate

router = APIRouter()


def check_item_permission(item, current_user, party):
    """登録者または主催者のみ編集・削除可"""
    uid = str(current_user["_id"])
    if item["registered_by"] != uid and party["owner_id"] != uid:
        raise HTTPException(status_code=403, detail="権限がありません")


@router.get("/{party_id}/items", summary="アイテム一覧取得")
def list_items(party_id: str, current_user=Depends(get_current_user)):
    # 参加者チェック
    party = db.parties.find_one({"_id": party_id})
    if not party:
        raise HTTPException(status_code=404, detail="パーティーが見つかりません")
    if str(current_user["_id"]) not in party["members"]:
        raise HTTPException(status_code=403, detail="このパーティーへのアクセス権がありません")
    items = list(db.items.find({"party_id": party_id}))
    # ObjectId を str に変換して返却
    return [{**item, "id": str(item["_id"])} for item in items]


@router.post("/{party_id}/items", summary="アイテム追加")
def add_item(party_id: str, item: ItemCreate, current_user=Depends(get_current_user)):
    party = db.parties.find_one({"_id": party_id})
    if not party:
        raise HTTPException(status_code=404, detail="パーティーが見つかりません")
    if str(current_user["_id"]) not in party["members"]:
        raise HTTPException(status_code=403, detail="参加者のみアイテムを追加できます")

    new_item = {
        "party_id": party_id,
        "name": item.name,
        "category": item.category,
        "quantity": item.quantity,
        "status": item.status.value,
        "registered_by": str(current_user["_id"]),
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    result = db.items.insert_one(new_item)
    return {"id": str(result.inserted_id), **new_item}


@router.patch("/{party_id}/items/{item_id}", summary="アイテム編集")
def update_item(party_id: str, item_id: str, body: ItemUpdate, current_user=Depends(get_current_user)):
    item = db.items.find_one({"_id": item_id, "party_id": party_id})
    if not item:
        raise HTTPException(status_code=404, detail="アイテムが見つかりません")
    party = db.parties.find_one({"_id": party_id})
    check_item_permission(item, current_user, party)

    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow().isoformat()
    db.items.update_one({"_id": item_id}, {"$set": update_data})
    return {"message": "更新しました"}


@router.patch("/{party_id}/items/{item_id}/status", summary="アイテムステータス更新")
def update_status(
    party_id: str,
    item_id: str,
    body: StatusUpdate,
    current_user=Depends(get_current_user),
):
    db.items.update_one(
        {"_id": item_id, "party_id": party_id},
        {"$set": {"status": body.status.value, "updated_at": datetime.utcnow().isoformat()}},
    )
    return {"message": "更新しました"}


@router.delete("/{party_id}/items/{item_id}", summary="アイテム削除")
def delete_item(party_id: str, item_id: str, current_user=Depends(get_current_user)):
    item = db.items.find_one({"_id": item_id, "party_id": party_id})
    if not item:
        raise HTTPException(status_code=404, detail="アイテムが見つかりません")
    party = db.parties.find_one({"_id": party_id})
    check_item_permission(item, current_user, party)
    db.items.delete_one({"_id": item_id})
    return {"message": "削除しました"}
