'use client';

// P02: ログイン画面
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // バリデーション
    if (!validateEmail(email)) {
      setError('正しいメールアドレスを入力してください');
      return;
    }
    if (!password) {
      setError('パスワードを入力してください');
      return;
    }

    setLoading(true);
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      // JWT を Cookie に保存
      document.cookie = `token=${data.access_token}; path=/`;
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'ログインに失敗しました';
      setError(message.includes('401') ? 'メールアドレスまたはパスワードが正しくありません' : message);
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
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '32px' }}>ログイン</h1>

      {error && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>メールアドレス</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            placeholder="example@email.com"
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>パスワード</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            placeholder="パスワードを入力"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ background: '#4f46e5', color: '#fff', padding: '12px', borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '16px', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
        アカウントをお持ちでない方は{' '}
        <Link href="/register" style={{ color: '#4f46e5', fontWeight: '500' }}>
          新規登録
        </Link>
      </p>
    </div>
  );
}
