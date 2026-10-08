export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.6rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.12em',
        }}
      >
        © 2026 Parardha Dhar
      </div>

      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.6rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.12em',
          display: 'flex',
          gap: 32,
        }}
      >
        {['Email', 'LinkedIn', 'GitHub'].map(link => (
          <a
            key={link}
            href={link === 'Email' ? 'mailto:parardhadhar@gmail.com' : link === 'LinkedIn' ? 'https://linkedin.com/in/parardhadhar' : 'https://github.com/parardhadhar'}
            style={{
              color: 'inherit',
              textDecoration: 'none',
              transition: 'color 0.3s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-main)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}
