'use client';

// P12: プロフィール設定画面
import { useState, useEffect } from 'react';
import { apiGet, apiPatch } from '@/lib/api';

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiGet('/api/users/me')
      .then((data) => {
        setDisplayName(data.display_name ?? '');
        setEmail(data.email ?? '');
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiPatch('/api/users/me', { display_name: displayName });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '24px' }}>プロフィール設定</h1>

      {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
      {success && <div style={{ background: '#dcfce7', color: '#166534', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>✓ 保存しました</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#fff', padding: '24px', borderRadius: '12px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>メールアドレス</label>
          <input type="email" value={email} readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '16px', background: '#f8fafc', color: '#94a3b8' }} />
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>メールアドレスは変更できません</p>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>表示名</label>
          <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }} required />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '12px', borderRadius: '6px', border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}>
          {loading ? '保存中...' : '変更を保存'}
        </button>
      </form>
    </div>
  );
}
