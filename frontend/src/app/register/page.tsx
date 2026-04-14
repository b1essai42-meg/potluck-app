'use client';

// P03: 新規登録画面
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // バリデーション
    if (!displayName.trim()) { setError('表示名を入力してください'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('正しいメールアドレスを入力してください'); return; }
    if (password.length < 8) { setError('パスワードは8文字以上で入力してください'); return; }
    if (password !== passwordConfirm) { setError('パスワードが一致しません'); return; }

    setLoading(true);
    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ display_name: displayName, email, password }),
      });
      router.push('/login');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '登録に失敗しました';
      setError(message.includes('400') ? 'このメールアドレスはすでに登録されています' : message);
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
    <div style={{ maxWidth: '400px', margin: '60px auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '32px' }}>新規登録</h1>

      {error && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>表示名</label>
          <input type="text" name="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} style={inputStyle} placeholder="山田太郎" required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>メールアドレス</label>
          <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="example@email.com" required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>パスワード（8文字以上）</label>
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="パスワードを入力" required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>パスワード確認</label>
          <input type="password" name="passwordConfirm" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} style={inputStyle} placeholder="パスワードを再入力" required />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ background: '#4f46e5', color: '#fff', padding: '12px', borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '16px', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? '登録中...' : 'アカウントを作成'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
        すでにアカウントをお持ちの方は{' '}
        <Link href="/login" style={{ color: '#4f46e5', fontWeight: '500' }}>ログイン</Link>
      </p>
    </div>
  );
}
