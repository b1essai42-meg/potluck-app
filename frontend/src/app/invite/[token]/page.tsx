'use client';

// P11: 招待受付画面
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiPost } from '@/lib/api';

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const isLoggedIn = document.cookie.split('; ').some((row) => row.startsWith('token='));

    if (!isLoggedIn) {
      // 未ログイン → 登録画面にリダイレクト
      router.push(`/register?redirect=/invite/${token}`);
      return;
    }

    // ログイン済み → パーティー参加
    apiPost(`/api/parties/${token}/join`, { invite_token: token })
      .then((data) => {
        if (data.party_id) {
          setStatus('success');
          setTimeout(() => router.push(`/parties/${data.party_id}/items`), 1500);
        }
      })
      .catch((err: Error) => {
        if (err.message.includes('409') || err.message.includes('すでに')) {
          setStatus('already');
          setMessage('すでにこのパーティーに参加しています');
        } else {
          setStatus('error');
          setMessage(err.message);
        }
      });
  }, [token, router]);

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', textAlign: 'center' }}>
      {status === 'loading' && (
        <>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔄</div>
          <p style={{ color: '#64748b' }}>招待を処理中...</p>
        </>
      )}
      {status === 'success' && (
        <>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎉</div>
          <p style={{ color: '#166534', fontWeight: 'bold' }}>パーティーへの参加が完了しました！</p>
          <p style={{ color: '#64748b', fontSize: '14px' }}>アイテムリストへ移動します...</p>
        </>
      )}
      {(status === 'error' || status === 'already') && (
        <>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>{status === 'already' ? 'ℹ️' : '❌'}</div>
          <p style={{ color: status === 'already' ? '#1d4ed8' : '#b91c1c' }}>{message}</p>
          <button onClick={() => router.push('/dashboard')} style={{ marginTop: '16px', background: '#4f46e5', color: '#fff', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
            ダッシュボードへ
          </button>
        </>
      )}
    </div>
  );
}
