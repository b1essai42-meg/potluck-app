'use client';

// P06: 参加者管理画面（主催者のみアクセス可）
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiGet } from '@/lib/api';
import type { Party } from '@/types';

export default function MembersPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [party, setParty] = useState<Party | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiGet(`/api/parties/${id}`)
      .then((data) => setParty(data))
      .catch(() => router.push('/dashboard'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const inviteUrl = party
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${party.invite_token}`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>読み込み中...</div>;
  if (!party) return null;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <button onClick={() => router.push(`/parties/${id}/items`)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '12px', fontSize: '14px' }}>← 戻る</button>
      <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '24px' }}>参加者管理 — {party.title}</h1>

      {/* 招待URL */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '20px', borderRadius: '10px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px', color: '#1d4ed8' }}>🔗 招待リンク</h2>
        <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#3b82f6' }}>このURLをメンバーに共有してください</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inviteUrl}
            readOnly
            style={{ flex: 1, padding: '10px 12px', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '13px', background: '#fff', color: '#374151' }}
          />
          <button
            onClick={handleCopy}
            style={{ padding: '10px 16px', background: copied ? '#16a34a' : '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {copied ? '✓ コピー済み' : 'コピー'}
          </button>
        </div>
      </div>

      {/* 参加者一覧 */}
      <div style={{ background: '#fff', borderRadius: '10px', padding: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px' }}>参加者一覧 ({party.members.length}名)</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {party.members.map((memberId) => (
            <div key={memberId} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f8fafc', borderRadius: '6px' }}>
              <div style={{ width: '36px', height: '36px', background: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                👤
              </div>
              <span style={{ fontSize: '14px' }}>{memberId}</span>
              {memberId === party.owner_id && (
                <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '500' }}>主催者</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
