'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface HeaderProps {
  role?: 'owner' | 'member' | null;
  partyId?: string;
}

export default function Header({ role, partyId }: HeaderProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='));
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    // Cookie からトークンを削除
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  return (
    <header style={{ background: '#4f46e5', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Link href={isLoggedIn ? '/dashboard' : '/'} style={{ color: '#fff', fontWeight: 'bold', fontSize: '20px', textDecoration: 'none' }}>
        🎉 PotluckShare
      </Link>

      <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {isLoggedIn ? (
          <>
            <Link href="/dashboard" style={{ color: '#e0e7ff', textDecoration: 'none' }}>
              ダッシュボード
            </Link>
            {/* 主催者のみ表示 */}
            {role === 'owner' && partyId && (
              <>
                <Link href={`/parties/${partyId}/members`} style={{ color: '#e0e7ff', textDecoration: 'none' }}>
                  参加者管理
                </Link>
                <Link href={`/parties/${partyId}/settings`} style={{ color: '#e0e7ff', textDecoration: 'none' }}>
                  パーティー設定
                </Link>
              </>
            )}
            <Link href="/profile" style={{ color: '#e0e7ff', textDecoration: 'none' }}>
              プロフィール
            </Link>
            <button
              onClick={handleLogout}
              style={{ background: '#818cf8', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
            >
              ログアウト
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ color: '#e0e7ff', textDecoration: 'none' }}>
              ログイン
            </Link>
            <Link
              href="/register"
              style={{ background: '#818cf8', color: '#fff', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none' }}
            >
              新規登録
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
