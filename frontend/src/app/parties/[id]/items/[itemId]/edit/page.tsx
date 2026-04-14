'use client';

// P10: アイテム編集画面
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiGet, apiPatch } from '@/lib/api';
import type { Item, ItemCategory } from '@/types';

const CATEGORIES: ItemCategory[] = ['料理', '飲み物', '備品', 'その他'];

export default function EditItemPage() {
  const { id, itemId } = useParams<{ id: string; itemId: string }>();
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('料理');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    apiGet(`/api/parties/${id}/items`)
      .then((items: Item[]) => {
        const item = items.find((i) => i.id === itemId);
        if (item) {
          setName(item.name);
          setCategory(item.category);
          setQuantity(item.quantity);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setFetching(false));
  }, [id, itemId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('品名を入力してください'); return; }
    setLoading(true);
    try {
      await apiPatch(`/api/parties/${id}/items/${itemId}`, { name, category, quantity });
      router.push(`/parties/${id}/items`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' };

  if (fetching) return <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>読み込み中...</div>;

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto' }}>
      <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '12px', fontSize: '14px' }}>← 戻る</button>
      <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '24px' }}>アイテムを編集</h1>

      {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#fff', padding: '24px', borderRadius: '12px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>品名</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>カテゴリ</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as ItemCategory)} style={inputStyle}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>数量</label>
          <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" onClick={() => router.back()} style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff' }}>キャンセル</button>
          <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', borderRadius: '6px', border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}>
            {loading ? '更新中...' : '変更を保存'}
          </button>
        </div>
      </form>
    </div>
  );
}
