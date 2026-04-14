'use client';

// P04: ダッシュボード画面
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import type { Party } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet('/api/parties')
      .then((data) => setParties(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>読み込み中...</div>;
  if (error) return <div style={{ color: '#b91c1c', padding: '20px' }}>エラー: {error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>ダッシュボード</h1>
        <Link
          href="/parties/new"
          style={{ background: '#4f46e5', color: '#fff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: '500' }}
        >
          ＋ 新しいパーティーを作成
        </Link>
      </div>

      {parties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px', color: '#64748b' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
          <p style={{ fontSize: '16px', margin: 0 }}>まだパーティーがありません。<br />「新しいパーティーを作成」から始めましょう！</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {parties.map((party) => (
            <div
              key={party.id}
              onClick={() => router.push(`/parties/${party.id}/items`)}
              style={{ background: '#fff', padding: '20px 24px', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', cursor: 'pointer', border: '1px solid #e2e8f0', transition: 'box-shadow 0.2s' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 'bold' }}>{party.title}</h2>
                  {party.date && (
                    <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '14px' }}>
                      📅 {new Date(party.date).toLocaleDateString('ja-JP')}
                    </p>
                  )}
                  {party.memo && (
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>{party.memo}</p>
                  )}
                </div>
                <span style={{
                  background: party.role === 'owner' ? '#dbeafe' : '#f0fdf4',
                  color: party.role === 'owner' ? '#1d4ed8' : '#15803d',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                }}>
                  {party.role === 'owner' ? '主催者' : '参加者'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
