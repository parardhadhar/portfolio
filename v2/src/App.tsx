import { lazy, Suspense } from 'react';
import FieldNotes from './field/FieldNotes';
const Game = lazy(() => import('./game/Game'));
export default function App() {
  return new URLSearchParams(location.search).get('experience') === 'island'
    ? <><a href="/" style={{position:'fixed',top:18,left:'50%',transform:'translateX(-50%)',zIndex:1000,padding:'9px 16px',borderRadius:30,background:'#18231dde',border:'1px solid #bbc7ad66',color:'#f3eddb',fontSize:11,textDecoration:'none',backdropFilter:'blur(12px)'}}>← Back to Field Notes</a><Suspense fallback={<div style={{padding:40}}>Preparing the island…</div>}><Game /></Suspense></>
    : <FieldNotes />;
}
