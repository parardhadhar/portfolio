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
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              fontWeight: 500,
              color: '#666',
              display: 'block',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}
          >
            / Let's Collaborate
          </span>
          <h2
            style={{
              fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              letterSpacing: '-0.04em',
              color: '#111',
              margin: '0 0 1rem',
              lineHeight: 1,
            }}
          >
            Have something{' '}
            <span
              style={{
                fontStyle: 'italic',
                color: '#666',
              }}
            >
              interesting
            </span>{' '}
            in mind?
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.05rem',
              color: '#444',
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
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.70rem',
                    letterSpacing: '0.05em',
                    color: '#666',
                    display: 'block',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    fontWeight: 500,
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
                    background: 'transparent',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 0,
                    padding: '14px 16px',
                    color: '#111',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.85rem',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => ((e.target as HTMLInputElement).style.borderColor = '#111')}
                  onBlur={e => ((e.target as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.1)')}
                />
              </div>
            ))}
            <div>
              <label
                htmlFor="message"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.70rem',
                  letterSpacing: '0.05em',
                  color: '#666',
                  display: 'block',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  fontWeight: 500,
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
                  background: 'transparent',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 0,
                  padding: '14px 16px',
                  color: '#111',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
                onFocus={e => ((e.target as HTMLTextAreaElement).style.borderColor = '#111')}
                onBlur={e => ((e.target as HTMLTextAreaElement).style.borderColor = 'rgba(0,0,0,0.1)')}
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
                background: sent ? '#EFEFEF' : '#111',
                color: sent ? '#111' : '#fff',
                border: sent ? '1px solid #CCC' : '1px solid #111',
                borderRadius: 0,
                padding: '16px 32px',
                fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: sending ? 'wait' : 'pointer',
                transition: 'all 0.3s',
                letterSpacing: '0.02em',
                marginTop: '8px',
              }}
              onMouseEnter={e => {
                if (!sent) {
                  (e.currentTarget as HTMLElement).style.background = '#333';
                  (e.currentTarget as HTMLElement).style.borderColor = '#333';
                }
              }}
              onMouseLeave={e => {
                if (!sent) {
                  (e.currentTarget as HTMLElement).style.background = '#111';
                  (e.currentTarget as HTMLElement).style.borderColor = '#111';
                }
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
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.70rem',
                  letterSpacing: '0.05em',
                  fontWeight: 500,
                  color: '#666',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                Direct mail
              </p>
              <a
                href="mailto:parardhadhar@gmail.com"
                style={{
                  fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  color: '#111',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(0,0,0,0.2)',
                  transition: 'opacity 0.3s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.6')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              >
                parardhadhar@gmail.com
              </a>
            </div>

            {/* Social links */}
            <div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.70rem',
                  letterSpacing: '0.05em',
                  fontWeight: 500,
                  color: '#666',
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
                      color: '#444',
                      textDecoration: 'none',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = '#111';
                      el.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = '#444';
                      el.style.transform = 'translateX(0)';
                    }}
                  >
                    {s.icon}
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* CV download */}
            <div style={{ marginTop: '20px' }}>
              <a
                href="/Parardha_Dhar_CV_0.pdf"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  border: '1px solid rgba(0,0,0,0.1)',
                  padding: '14px 28px',
                  borderRadius: 0,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  color: '#111',
                  background: 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = '#111';
                  el.style.color = '#fff';
                  el.style.borderColor = '#111';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'transparent';
                  el.style.color = '#111';
                  el.style.borderColor = 'rgba(0,0,0,0.1)';
                }}
              >
                ↓ Download CV
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
