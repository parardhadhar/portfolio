export const destinations = [
  { id: 'about', name: 'The studio', category: 'MEET THE MAKER', x: -16, z: 12, color: '#e8986a', number: '01' },
  { id: 'work', name: 'Project park', category: 'SELECTED WORK', x: 15, z: 11, color: '#b4b2ef', number: '02' },
  { id: 'tech', name: 'The laboratory', category: 'TOOLS & EDUCATION', x: 14, z: -15, color: '#c3d89d', number: '03' },
  { id: 'contact', name: 'Hello station', category: 'LET\'S MAKE SOMETHING', x: -15, z: -14, color: '#f0c57e', number: '04' },
] as const;
export type DestinationId = typeof destinations[number]['id'];

export const projects = [
  {
    title: 'SafeRoute India',
    type: 'FULL-STACK · AI · GIS',
    text: 'AI-powered women\'s safety intelligence dashboard with real-time NCRB crime data, interactive GIS mapping, risk scoring and a cinematic interface.',
    href: 'https://github.com/parardhadhar',
    image: 'https://iili.io/B7gKcIn.png',
  },
  {
    title: 'ISL Recognition System',
    type: 'COMPUTER VISION · MEDIAPIPE',
    text: 'Real-time pipeline converting Indian Sign Language gestures into text and speech using MediaPipe and TensorFlow. Achieved 94% accuracy.',
    href: 'mailto:parardhadhar@gmail.com?subject=ISL%20Recognition%20System',
    image: 'https://iili.io/B7gKcIn.png',
  },
  {
    title: 'RGC Community Hub',
    type: 'FULL-STACK PLATFORM',
    text: 'Community platform for VIT Bhopal VRGC — Next.js, Supabase and Firebase. Real-time events, member profiles and club management.',
    href: 'https://vrgc.vercel.app',
    image: 'https://iili.io/B7UxoJ4.png',
  },
  {
    title: 'PhishGuard',
    type: 'MACHINE LEARNING · DOCKER',
    text: 'ML system for detecting phishing URLs using ensemble classifiers. Packaged with Docker and a REST API. 97% detection rate.',
    href: 'https://github.com/parardhadhar/phishguard',
    image: 'https://iili.io/B7Uj8la.png',
  },
  {
    title: 'Insight Engine',
    type: 'GENERATIVE AI · RAG',
    text: 'Multi-document QA with retrieval-augmented generation and FAISS vector search. Deployed on Hugging Face Spaces.',
    href: 'https://huggingface.co/spaces/parardhadhar/Parardha-Insight-Engine',
    image: 'https://iili.io/B7glXix.png',
  },
  {
    title: 'UE5 Cave & Beach',
    type: 'UNREAL ENGINE 5',
    text: 'Photorealistic Unreal Engine 5 environments — Lumen ray-traced GI, Nanite geometry, dynamic ocean simulation and bioluminescent cave flora.',
    href: 'mailto:parardhadhar@gmail.com?subject=Unreal%20Engine%20environment',
    image: '/projects/cave/hero.png',
  },
];
