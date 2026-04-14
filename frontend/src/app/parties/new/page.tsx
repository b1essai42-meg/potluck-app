'use client';

// P05: パーティー作成画面
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '@/lib/api';

export default function NewPartyPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('パーティー名を入力してください');
      return;
    }

    setLoading(true);
    try {
      const party = await apiPost('/api/parties', { title, date: date || undefined, memo: memo || undefined });
      router.push(`/parties/${party.id}/items`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'パーティーの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '16px',
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '24px' }}>新しいパーティーを作成</h1>

      {error && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#fff', padding: '24px', borderRadius: '12px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>パーティー名 <span style={{ color: '#ef4444' }}>*</span></label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} placeholder="例：春の持ち寄りパーティー" required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>開催日時（任意）</label>
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>メモ（任意）</label>
          <textarea value={memo} onChange={(e) => setMemo(e.target.value)} style={{ ...inputStyle, height: '80px', resize: 'vertical' }} placeholder="場所、注意事項など..." />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" onClick={() => router.back()} style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff', fontWeight: '500' }}>
            キャンセル
          </button>
          <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', borderRadius: '6px', border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}>
            {loading ? '作成中...' : 'パーティーを作成'}
          </button>
        </div>
      </form>
    </div>
  );
}
