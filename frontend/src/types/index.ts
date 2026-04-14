// ユーザー型定義
export interface User {
  id: string;
  email: string;
  display_name: string;
}

// パーティー型定義
export interface Party {
  id: string;
  title: string;
  date?: string;
  memo?: string;
  owner_id: string;
  invite_token: string;
  members: string[];
  created_at: string;
  role?: 'owner' | 'member'; // フロントエンドで付与
}

// アイテム型定義
export type ItemStatus = '準備中' | '完了';
export type ItemCategory = '料理' | '飲み物' | '備品' | 'その他';

export interface Item {
  id: string;
  party_id: string;
  name: string;
  category: ItemCategory;
  quantity: string;
  status: ItemStatus;
  registered_by: string;
  updated_at?: string;
}

// API レスポンス型
export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface CreatePartyInput {
  title: string;
  date?: string;
  memo?: string;
}

export interface CreateItemInput {
  name: string;
  category: ItemCategory;
  quantity: string;
}

export interface UpdateItemStatusInput {
  status: ItemStatus;
}
