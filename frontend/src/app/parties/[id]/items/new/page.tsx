'use client';

// P09: アイテム追加画面
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiPost } from '@/lib/api';
import type { ItemCategory } from '@/types';

const CATEGORIES: ItemCategory[] = ['料理', '飲み物', '備品', 'その他'];

export default function NewItemPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('料理');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('品名を入力してください'); return; }
    if (!quantity.trim()) { setError('数量を入力してください'); return; }

    setLoading(true);
    try {
      await apiPost(`/api/parties/${id}/items`, { name, category, quantity });
      router.push(`/parties/${id}/items`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'アイテムの追加に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto' }}>
      <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '12px', fontSize: '14px' }}>← 戻る</button>
      <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '24px' }}>アイテムを追加</h1>

      {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#fff', padding: '24px', borderRadius: '12px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>品名 <span style={{ color: '#ef4444' }}>*</span></label>
          <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="例：唐揚げ" required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>カテゴリ</label>
          <select name="category" value={category} onChange={(e) => setCategory(e.target.value as ItemCategory)} style={inputStyle}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>数量 <span style={{ color: '#ef4444' }}>*</span></label>
          <input type="text" name="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} style={inputStyle} placeholder="例：4人前、2本" required />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" onClick={() => router.back()} style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff', fontWeight: '500' }}>キャンセル</button>
          <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', borderRadius: '6px', border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}>
            {loading ? '追加中...' : 'アイテムを追加'}
          </button>
        </div>
      </form>
    </div>
  );
}
