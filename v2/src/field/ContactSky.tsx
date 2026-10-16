import { Copy, Check, Download, Mail } from 'lucide-react';
import './ContactSky.css';
function Github(){return <svg width="43" height="43" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>}
function Instagram(){return <svg width="43" height="43" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>}
function Linkedin(){return <svg width="43" height="43" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="3"/><path fill="#277fc3" d="M5 9h3v10H5zm1.5-5a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2ZM10 9h3v1.4c1.6-2.4 6-2.3 6 2.6v6h-3v-5.4c0-2.4-3-2.1-3 0V19h-3Z"/></svg>}


export default function ContactSky({resumeUrl,copied,copyEmail}:{resumeUrl:string;copied:boolean;copyEmail:()=>void}){
 const links=[
  {key:'M',title:'Email me',note:'An idea, a role, or just hello.',href:'mailto:parardhadhar@gmail.com',icon:Mail,color:'coral'},
  {key:'G',title:'GitHub',note:'The things I build, out in the open.',href:'https://github.com/parardhadhar',icon:Github,color:'ink'},
  {key:'I',title:'Instagram',note:'A little life outside the editor.',href:'https://www.instagram.com/parardha.er/',icon:Instagram,color:'rose'},
  {key:'L',title:'LinkedIn',note:'Work, people, and the next chapter.',href:'https://www.linkedin.com/in/parardhadhar',icon:Linkedin,color:'blue'},
  {key:'R',title:'Résumé',note:'My story, in a few pages.',href:resumeUrl,icon:Download,color:'gold'},
 ];
 return <section id="contact" data-section className="fn-contact fn-section fn-reveal contact-sky">
  <div className="footer-cloud cloud-left" aria-hidden="true"/><div className="footer-cloud cloud-right" aria-hidden="true"/><div className="footer-cloud cloud-floor" aria-hidden="true"/>
  <div className="sky-heading"><span className="section-kicker">THE NEXT CHAPTER / LET’S TALK</span><h2>Good things start<br/>with a little <span className="scribble">hello.</span></h2><p>Have something in mind? Let’s turn that<br/>“what if” into something worth making.</p><span className="sky-star" aria-hidden="true">✳</span></div>
  <div className="contact-console"><p className="console-hint">A few ways to find me. <span>Try Shift + M, G, L or R ↗</span></p><div className="sky-keys">{links.map(link=><div className="sky-key-group" key={link.key}><a className={`sky-key sky-${link.color}`} href={link.href} target={link.key==='M'?undefined:'_blank'} rel="noreferrer" aria-label={link.title}><kbd>{link.key}</kbd><link.icon/></a><strong>{link.title}</strong><p>{link.note}</p></div>)}</div><button className="copy-email" onClick={copyEmail}>{copied?<Check size={16}/>:<Copy size={16}/>} {copied?'Email copied!':'parardhadhar@gmail.com'}</button></div>
  <footer><span>PARARDHA DHAR © {new Date().getFullYear()}</span><span>Made of curiosity, code & a little wonder.</span><a href="#home">Back to the valley ↑</a></footer>
 </section>;
}
