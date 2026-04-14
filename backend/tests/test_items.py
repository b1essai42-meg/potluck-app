# backend/tests/test_items.py
"""アイテム API の統合テスト"""


def _register_and_login(client, email: str, password: str = "pass1234", name: str = "テスト"):
    client.post("/api/auth/register", json={"email": email, "password": password, "display_name": name})
    token = client.post("/api/auth/login", json={"email": email, "password": password}).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_add_item_as_member(client):
    """参加メンバーがアイテムを追加できる"""
    headers = _register_and_login(client, "a@test.com")
    # パーティー作成
    party_id = client.post("/api/parties", json={"title": "テストパーティー"}, headers=headers).json()["id"]
    # アイテム追加
    res = client.post(
        f"/api/parties/{party_id}/items",
        json={"name": "唐揚げ", "category": "料理", "quantity": "4人前"},
        headers=headers,
    )
    assert res.status_code == 200


def test_add_item_unauthorized(client):
    """認証なしでアイテム追加を試みると 401"""
    res = client.post(
        "/api/parties/dummy_id/items",
        json={"name": "ビール", "category": "飲み物", "quantity": "6本"},
    )
    assert res.status_code == 401


def test_item_status_update(client):
    """アイテムのステータスを更新できる"""
    headers = _register_and_login(client, "b@test.com")
    party_id = client.post("/api/parties", json={"title": "パーティー2"}, headers=headers).json()["id"]
    item_id = client.post(
        f"/api/parties/{party_id}/items",
        json={"name": "サラダ", "category": "料理", "quantity": "1皿"},
        headers=headers,
    ).json()["id"]

    res = client.patch(
        f"/api/parties/{party_id}/items/{item_id}/status",
        json={"status": "完了"},
        headers=headers,
    )
    assert res.status_code == 200
    assert res.json()["message"] == "更新しました"
