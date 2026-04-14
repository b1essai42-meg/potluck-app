# backend/tests/test_auth.py
"""認証エンドポイントの単体テスト"""


def test_register_success(client):
    """正常な新規登録"""
    res = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "password123",
        "display_name": "テストユーザー",
    })
    assert res.status_code == 200
    assert "id" in res.json()


def test_register_duplicate_email(client):
    """重複メールで登録するとエラー"""
    data = {"email": "dup@example.com", "password": "pass1234", "display_name": "テスト"}
    client.post("/api/auth/register", json=data)
    res = client.post("/api/auth/register", json=data)
    assert res.status_code == 400  # 重複メール


def test_login_success(client):
    """正常なログイン → JWT が返る"""
    client.post("/api/auth/register", json={
        "email": "login@example.com",
        "password": "pass1234",
        "display_name": "テスト",
    })
    res = client.post("/api/auth/login", json={
        "email": "login@example.com",
        "password": "pass1234",
    })
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_login_wrong_password(client):
    """誤ったパスワードで 401 が返る"""
    res = client.post("/api/auth/login", json={
        "email": "none@example.com",
        "password": "wrong",
    })
    assert res.status_code == 401
