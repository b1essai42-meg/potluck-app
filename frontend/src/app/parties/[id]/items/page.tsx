'use client';

// P08: アイテム一覧（共有リスト）画面 ← 最も重要な画面
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiGet, apiPatch, apiDelete } from '@/lib/api';
import type { Item, Party } from '@/types';

export default function ItemsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [party, setParty] = useState<Party | null>(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      const data = await apiGet(`/api/parties/${id}/items`);
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  useEffect(() => {
    // 初回データ取得
    Promise.all([
      apiGet(`/api/parties/${id}`),
      fetchItems(),
    ]).then(([partyData]) => {
      setParty(partyData);
      setLoading(false);
    }).catch(() => setLoading(false));

    // 5秒ごとに自動更新
    const timer = setInterval(fetchItems, 5000);
    return () => clearInterval(timer);
  }, [id, fetchItems]);

  const handleStatusToggle = async (item: Item) => {
    const newStatus = item.status === '準備中' ? '完了' : '準備中';
    try {
      await apiPatch(`/api/parties/${id}/items/${item.id}/status`, { status: newStatus });
      await fetchItems();
    } catch (err) {
      alert('ステータスの更新に失敗しました');
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('このアイテムを削除しますか？')) return;
    try {
      await apiDelete(`/api/parties/${id}/items/${itemId}`);
      await fetchItems();
    } catch (err) {
      alert('削除に失敗しました');
    }
  };

  const canEdit = (item: Item) => item.registered_by === currentUserId || party?.owner_id === currentUserId;

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>読み込み中...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '4px', fontSize: '14px' }}>
            ← ダッシュボードへ
          </button>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>{party?.title ?? 'パーティー'} — 持ち寄りリスト</h1>
        </div>
        <Link
          href={`/parties/${id}/items/new`}
          style={{ background: '#4f46e5', color: '#fff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: '500' }}
        >
          ＋ アイテムを追加
        </Link>
      </div>

      {/* デスクトップ: テーブル表示 */}
      <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }} className="hidden md:block">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              {['品名', 'カテゴリ', '数量', '担当者', 'ステータス', '操作'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                  まだアイテムがありません。「アイテムを追加」から登録しましょう！
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '500' }}>{item.name}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>{item.category}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>{item.quantity}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{item.registered_by}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => handleStatusToggle(item)}
                      style={{
                        background: item.status === '完了' ? '#dcfce7' : '#fef9c3',
                        color: item.status === '完了' ? '#166534' : '#854d0e',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {canEdit(item) && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => router.push(`/parties/${id}/items/${item.id}/edit`)} style={{ background: '#e0e7ff', color: '#4f46e5', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                          編集
                        </button>
                        <button onClick={() => handleDelete(item.id)} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                          削除
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* モバイル: カード表示 */}
      <div className="block md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((item) => (
          <div key={item.id} style={{ background: '#fff', padding: '16px', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>{item.name}</span>
              <button onClick={() => handleStatusToggle(item)} style={{ background: item.status === '完了' ? '#dcfce7' : '#fef9c3', color: item.status === '完了' ? '#166534' : '#854d0e', border: 'none', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer' }}>
                {item.status}
              </button>
            </div>
            <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#64748b' }}>{item.category} · {item.quantity}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>担当: {item.registered_by}</p>
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'right', fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>5秒ごとに自動更新</p>
    </div>
  );
}
