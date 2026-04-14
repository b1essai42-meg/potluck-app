// P01: ランディングページ
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ maxWidth: '640px', margin: '80px auto', textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>
        PotluckShare
      </h1>
      <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '40px', lineHeight: '1.6' }}>
        持ち寄りパーティーのアイテム管理を<br />
        みんなでシェアしよう。誰が何を持ってくるか<br />
        一目でわかる共有リスト。
      </p>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <Link
          href="/login"
          style={{
            background: '#4f46e5',
            color: '#fff',
            padding: '14px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          ログイン
        </Link>
        <Link
          href="/register"
          style={{
            background: '#fff',
            color: '#4f46e5',
            padding: '14px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            border: '2px solid #4f46e5',
          }}
        >
          新規登録
        </Link>
      </div>

      <div style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {[
          { icon: '📋', title: 'リスト共有', desc: 'パーティーのアイテムリストをメンバー全員でリアルタイム共有' },
          { icon: '✅', title: 'ステータス管理', desc: '準備中→完了のステータスで何が揃ったか一目瞭然' },
          { icon: '🔗', title: '招待リンク', desc: '招待URLを共有するだけで簡単にパーティーに参加できる' },
        ].map((feature) => (
          <div key={feature.title} style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{feature.icon}</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 'bold' }}>{feature.title}</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
