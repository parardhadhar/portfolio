import type { ReactNode } from 'react';

// Small grid-drawn interpretations preserve the familiar silhouettes and brand colours.
const art:Record<string,ReactNode>={
 Python:<><path fill="#3776ab" d="M10 3h11v2h3v10H12v3H4v-3H2V9h3V7h5Z"/><path fill="#ffd343" d="M22 29H11v-2H8V17h12v-3h8v3h2v6h-3v2h-5Z"/><path fill="#fff" d="M13 6h3v3h-3zm4 17h3v3h-3z"/></>,
 PyTorch:<><path fill="#ee4c2c" d="M15 2h4v9h-4v3h-4v3H8v7h3v3h10v-3h3v-7h-3v-4h4v3h3v10h-4v4H9v-3H5V16h3v-3h3V9h4Z"/><path fill="#ee4c2c" d="M24 4h4v4h-4z"/></>,
 OpenCV:<><path fill="#ef5350" d="M13 2h7v3h3v7h-4V7h-5v5h-4V5h3Z"/><path fill="#70bd45" d="M5 15h7v3H7v6h6v-4h4v7h-4v3H5v-3H2v-9h3Z"/><path fill="#448aff" d="M22 15h7v3h-5v6h6v4h-9v-3h-3v-7h4Z"/></>,
 TypeScript:<><path fill="#3178c6" d="M2 2h28v28H2z"/><path stroke="#fff" strokeWidth="2.7" fill="none" d="M6 15h12m-6 0v12m15-11h-5v5h5v6h-6"/></>,
 React:<><path stroke="#61dafb" fill="none" strokeWidth="2" d="M2 12h28v8H2zM9 3h6l10 23-7 3ZM23 3h-6L7 26l7 3Z"/><path fill="#61dafb" d="M14 14h4v4h-4z"/></>,
 FastAPI:<><path fill="#009688" d="M10 2h12v3h5v5h3v12h-3v5h-5v3H10v-3H5v-5H2V10h3V5h5Z"/><path fill="#fff" d="M17 6h7l-8 10h6L10 27l4-11H8Z"/></>,
 PostgreSQL:<><path fill="#336791" stroke="#d5e5ef" strokeWidth="1" d="M5 5h20v3h4v12h-5v8h-4v-9h-4v8h-5v-9H6v-4H3V8h2Z"/><path fill="#fff" d="M9 10h3v3H9zm12 0h3v3h-3z"/><path stroke="#b8d7ed" fill="none" strokeWidth="2" d="M15 9v11l4 3 4-3m-5 3v7h-4"/></>,
 Redis:<><path fill="#a41e11" d="m2 23 14-6 14 6v3l-14 6L2 26Z"/><path fill="#dc382d" d="m2 19 14-6 14 6v3l-14 6L2 22Zm0-8 14-6 14 6v3l-14 6L2 14Z"/><path fill="#fff" d="M10 10h6v3h-6zm8 1h7v2h-7z"/></>,
 'Three.js':<><path stroke="#e8e9df" fill="none" strokeWidth="2" d="m5 3 23 8-16 19Zm3 10 16 5M8 13l10-5m-6 22 3-15L5 3m10 12 13-4m-13 4 4 9"/></>,
 Docker:<><path fill="#2496ed" d="M2 16h24v4h-3v5h-5v3H8v-3H4v-4H2Zm23-7h4v4h3v4h-7Z"/><path fill="#38b4ee" d="M5 10h5v5H5zm6 0h5v5h-5zm6 0h5v5h-5zM11 4h5v5h-5zm6 0h5v5h-5z"/><path fill="#fff" d="M7 19h2v2H7z"/></>,
};
export default function PixelTechIcon({name}:{name:string}){return <svg className="pixel-tech-icon" viewBox="0 0 32 32" shapeRendering="crispEdges" aria-hidden="true">{art[name]}</svg>;}
