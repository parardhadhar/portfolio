export const destinations = [
  { id: 'about', name: 'The studio', category: 'MEET THE MAKER', x: -16, z: 12, color: '#e8986a', number: '01' },
  { id: 'work', name: 'Project park', category: 'SELECTED WORK', x: 15, z: 11, color: '#b4b2ef', number: '02' },
  { id: 'tech', name: 'The laboratory', category: 'TOOLS & EDUCATION', x: 14, z: -15, color: '#c3d89d', number: '03' },
  { id: 'contact', name: 'Hello station', category: 'LET’S MAKE SOMETHING', x: -15, z: -14, color: '#f0c57e', number: '04' },
] as const;
export type DestinationId = typeof destinations[number]['id'];
export const projects = [
  { title: 'RGC Community Hub', type: 'FULL-STACK PLATFORM', text: 'A community platform for VIT Bhopal VRGC, built with Next.js, Supabase and Firebase.', href: 'https://vrgc.vercel.app', image: 'https://iili.io/B7UxoJ4.png' },
  { title: 'ISL Recognition System', type: 'COMPUTER VISION', text: 'A real-time pipeline turning Indian Sign Language into text and speech using MediaPipe and TensorFlow.', href: 'mailto:parardhadhar@gmail.com?subject=ISL%20Recognition%20System', image: 'https://iili.io/B7gKcIn.png' },
  { title: 'PhishGuard', type: 'MACHINE LEARNING', text: 'A machine learning system for detecting phishing URLs, packaged with Docker and a REST API.', href: 'https://github.com/parardhadhar/phishguard', image: 'https://iili.io/B7Uj8la.png' },
  { title: 'Insight Engine', type: 'GENERATIVE AI', text: 'Multi-document question answering with retrieval-augmented generation and FAISS.', href: 'https://huggingface.co/spaces/parardhadhar/Parardha-Insight-Engine', image: 'https://iili.io/B7glXix.png' },
  { title: 'Krishi Sahayak', type: 'AI FOR AGRICULTURE', text: 'Crop disease recognition and farming recommendations powered by a convolutional neural network.', href: 'https://github.com/parardhadhar/Krishi-Sahayak', image: 'https://iili.io/B7ggyUN.png' },
  { title: 'Cave Environment', type: 'UNREAL ENGINE 5', text: 'An atmospheric environment exploring Lumen lighting, Nanite geometry and cinematic world building.', href: 'mailto:parardhadhar@gmail.com?subject=Unreal%20Engine%20environment', image: '/projects/cave/hero.png' },
];
