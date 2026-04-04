import { useRef, useState } from 'react';
import ScrollReveal from './ScrollReveal';
import { Send, Mail } from 'lucide-react';

const socials = [
  { icon: <Mail size={18} />, label: 'Email', href: 'mailto:parardhadhar@gmail.com' },
  { icon: <span style={{ fontSize: 18 }}>in</span>, label: 'LinkedIn', href: '#' },
  { icon: <span style={{ fontSize: 18, fontFamily: 'monospace' }}>gh</span>, label: 'GitHub', href: '#' },
];

export default function Contact() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      formRef.current?.reset();
      setTimeout(() => setSent(false), 4000);
    }, 1500);
  };

  return (
    <section
      id="contact"
      style={{
        padding: '140px 40px 100px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              color: '#d4ff00',
              display: 'block',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}
          >
            / Let's Collaborate
          </span>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              letterSpacing: '-0.03em',
              color: '#fff',
              margin: '0 0 1rem',
              lineHeight: 1,
            }}
          >
            Have something{' '}
            <span
              style={{
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #08f7fe, #d4ff00, #FF9FFC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              interesting
            </span>{' '}
            in mind?
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1rem',
              color: 'rgba(200,210,230,0.55)',
              maxWidth: 500,
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            I'm always open to new projects, creative collaborations, or just a good conversation about tech and art.
          </p>
        </div>
      </ScrollReveal>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 60,
          alignItems: 'start',
        }}
      >
        {/* Contact form */}
        <ScrollReveal from="left">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {[
              { id: 'name', label: 'Your Name', type: 'text', placeholder: 'John Doe' },
              { id: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
            ].map(field => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.6rem',
                    letterSpacing: '0.15em',
                    color: 'rgba(200,220,255,0.45)',
                    display: 'block',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                  }}
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    padding: '14px 16px',
                    color: '#fff',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.85rem',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => ((e.target as HTMLInputElement).style.borderColor = '#d4ff00')}
                  onBlur={e => ((e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
            ))}
            <div>
              <label
                htmlFor="message"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.6rem',
                  letterSpacing: '0.15em',
                  color: 'rgba(200,220,255,0.45)',
                  display: 'block',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                }}
              >
                Message
              </label>
              <textarea
                id="message"
                placeholder="Tell me about your project..."
                required
                rows={5}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  padding: '14px 16px',
                  color: '#fff',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
                onFocus={e => ((e.target as HTMLTextAreaElement).style.borderColor = '#d4ff00')}
                onBlur={e => ((e.target as HTMLTextAreaElement).style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
            <button
              type="submit"
              disabled={sending || sent}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: sent ? 'rgba(212,255,0,0.15)' : '#d4ff00',
                color: sent ? '#d4ff00' : '#000',
                border: sent ? '1px solid #d4ff00' : 'none',
                borderRadius: 100,
                padding: '16px 32px',
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: sending ? 'wait' : 'pointer',
                transition: 'all 0.3s',
                letterSpacing: '0.05em',
              }}
              onMouseEnter={e => {
                if (!sent) {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(212,255,0,0.3)';
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'none';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {sent ? '✓ Message Sent!' : sending ? 'Sending...' : <><Send size={15} /> Send Message</>}
            </button>
          </form>
        </ScrollReveal>

        {/* Right side info */}
        <ScrollReveal from="right" delay={0.15}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {/* Direct email */}
            <div>
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  color: 'rgba(200,220,255,0.35)',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                Direct mail
              </p>
              <a
                href="mailto:parardhadhar@gmail.com"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: '#d4ff00',
                  textDecoration: 'none',
                  transition: 'opacity 0.3s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              >
                parardhadhar@gmail.com
              </a>
            </div>

            {/* Social links */}
            <div>
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  color: 'rgba(200,220,255,0.35)',
                  textTransform: 'uppercase',
                  marginBottom: 16,
                }}
              >
                Find me online
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {socials.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      color: 'rgba(200,220,255,0.6)',
                      textDecoration: 'none',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.9rem',
                      transition: 'all 0.3s',
                      padding: '12px 16px',
                      borderRadius: 12,
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = '#d4ff00';
                      el.style.background = 'rgba(212,255,0,0.06)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = 'rgba(200,220,255,0.6)';
                      el.style.background = 'transparent';
                    }}
                  >
                    {s.icon}
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* CV download */}
            <a
              href="/Parardha_Dhar_CV_0.pdf"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '14px 28px',
                borderRadius: 100,
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: '0.8rem',
                color: '#fff',
                textDecoration: 'none',
                transition: 'all 0.3s',
                letterSpacing: '0.05em',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = '#d4ff00';
                el.style.color = '#d4ff00';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(255,255,255,0.15)';
                el.style.color = '#fff';
              }}
            >
              ↓ Download CV
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
