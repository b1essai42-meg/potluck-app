'use client';

// P07: パーティー設定画面（主催者のみ）
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiGet, apiPatch, apiDelete } from '@/lib/api';
import type { Party } from '@/types';

export default function PartySettingsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [party, setParty] = useState<Party | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    apiGet(`/api/parties/${id}`)
      .then((data: Party) => {
        setParty(data);
        setTitle(data.title);
        setDate(data.date ?? '');
        setMemo(data.memo ?? '');
      })
      .catch(() => router.push('/dashboard'));
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiPatch(`/api/parties/${id}`, { title, date: date || undefined, memo: memo || undefined });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`「${party?.title}」を削除しますか？この操作は元に戻せません。`)) return;
    try {
      await apiDelete(`/api/parties/${id}`);
      router.push('/dashboard');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : '削除に失敗しました');
    }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' };

  if (!party) return <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>読み込み中...</div>;

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto' }}>
      <button onClick={() => router.push(`/parties/${id}/items`)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '12px', fontSize: '14px' }}>← 戻る</button>
      <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '24px' }}>パーティー設定</h1>

      {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
      {success && <div style={{ background: '#dcfce7', color: '#166534', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>✓ 保存しました</div>}

      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#fff', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>パーティー名</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>開催日時</label>
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>メモ</label>
          <textarea value={memo} onChange={(e) => setMemo(e.target.value)} style={{ ...inputStyle, height: '80px', resize: 'vertical' }} />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '12px', borderRadius: '6px', border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}>
          {loading ? '保存中...' : '変更を保存'}
        </button>
      </form>

      {/* 危険ゾーン */}
      <div style={{ background: '#fff5f5', border: '1px solid #fecaca', padding: '20px', borderRadius: '10px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: '#b91c1c', margin: '0 0 8px' }}>⚠️ 危険ゾーン</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 12px' }}>パーティーを削除すると、すべてのアイテムデータも削除されます。</p>
        <button onClick={handleDelete} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}>
          パーティーを削除
        </button>
      </div>
    </div>
  );
}
