FROM python:3.11-slim

WORKDIR /app

# システム依存のインストール
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Python 依存のインストール（レイヤーキャッシュのため先にコピー）
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリコードをコピー
COPY . .

EXPOSE 8000

# uvicorn で起動（コンテナ内のホスト名は 0.0.0.0 にする）
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
