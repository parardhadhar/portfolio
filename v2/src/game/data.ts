export const destinations = [
  { id: 'about', name: 'The studio', category: 'MEET THE MAKER', x: -16, z: 12, color: '#e8986a', number: '01' },
  { id: 'work', name: 'Project park', category: 'SELECTED WORK', x: 15, z: 11, color: '#b4b2ef', number: '02' },
  { id: 'tech', name: 'The laboratory', category: 'TOOLS & EDUCATION', x: 14, z: -15, color: '#c3d89d', number: '03' },
  { id: 'contact', name: 'Hello station', category: 'LET\'S MAKE SOMETHING', x: -15, z: -14, color: '#f0c57e', number: '04' },
] as const;
export type DestinationId = typeof destinations[number]['id'];

export const resumeUrl = '/Parardha_Dhar_SDE_Resume.pdf';
export const profile = {
  introduction: 'Computer Science undergraduate at VIT Bhopal and former Intern at IISc Bangalore. I build full-stack applications, automation systems, AI integrations, and immersive digital experiences.',
  experience: 'At IISc Bangalore (June–July 2026), I built TEM AI Studio for electron-microscopy analysis. It reduced manual defect calculation from over two hours to under 15 seconds per micrograph. My work combined PyTorch diffusion models, YOLOv11, OpenCV, FastAPI, and a React/Electron interface.',
  leadership: 'Founder & President of the Virtual Reality and Gaming Club (VRGC) at VIT Bhopal.',
};
export const skillGroups = [
  ['LANGUAGES', 'Python · Java · C++ · JavaScript · TypeScript · SQL'],
  ['BACKEND & DATA', 'Node.js · Express · FastAPI · PostgreSQL · Redis · BullMQ · SQLAlchemy · REST APIs'],
  ['FRONTEND & AI', 'React · Next.js · Tailwind CSS · Electron · PyTorch · OpenCV · scikit-learn · Groq · LLM APIs'],
  ['TOOLS', 'Git · Docker · GitHub Actions · Linux/Unix · Vercel · Supabase · Firebase'],
  ['EDUCATION', 'B.Tech, Computer Science & Engineering · VIT Bhopal University · Sep 2024–Expected 2028 · GPA 8.45/10.0'],
  ['CERTIFICATIONS', 'Oracle OCI 2025 Generative AI Professional · ISRO AI/ML for Geo Data Analysis · DeepLearning.AI Supervised Machine Learning · IBM Machine Learning with Python'],
  ['PROBLEM SOLVING', '100+ programming problems across LeetCode, Codeforces, GeeksforGeeks, and HackerRank'],
];
export const projects = [
  { title: 'FlowHook', type: 'WEBHOOK AUTOMATION / AI', text: 'Signed GitHub and Stripe webhook ingestion with duplicate detection, Redis/BullMQ workers, five-attempt exponential retries, persisted execution traces, and Groq summarization. Verified with 13 signature and AI tests.', href: 'https://github.com/parardhadhar/FlowHookCore#readme', image: '', motif: 'flow', tags: 'TypeScript · PostgreSQL · Redis · Next.js · Docker' },
  { title: 'Grahak', type: 'AI-ASSISTED WHATSAPP CRM', text: 'Customer inbox, searchable contacts, notes, and follow-ups with JWT authentication and business-scoped data access. AI summaries, WhatsApp sync with duplicate protection, and a persistent retry outbox. Backend verified with 23 tests.', href: 'https://grahak-flame.vercel.app', image: '', motif: 'chat', tags: 'Next.js · FastAPI · SQLAlchemy · Groq · Baileys' },
  { title: 'VRGC Community Hub', type: 'LIVE COMMUNITY PLATFORM', text: 'Independently built and deployed for 1,800+ unique visitors and 8,300+ page views. Managed live operations during a high-traffic event and achieved a 96/100 Vercel Real Experience Score.', href: 'https://vrgc.live', image: 'https://iili.io/B7UxoJ4.png', motif: 'community', tags: 'Next.js · React · Supabase · Firebase · CI/CD' },
  { title: 'TEM AI Studio', type: 'IISC / INTERNSHIP', text: 'Electron-microscopy analysis with diffusion denoising, YOLOv11 defect detection, 2D FFT analysis, and Burgers vector calculations for 50+ megapixel scans. Denoising improved downstream defect detection accuracy by 45%.', href: 'https://github.com/parardhadhar/AI-Crystallography-Engine', image: '', motif: 'lattice', tags: 'PyTorch · OpenCV · FastAPI · React · Electron' },
];
