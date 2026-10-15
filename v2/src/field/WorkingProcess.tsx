import CharacterSprite from './CharacterSprite';
import { InlineDetail, RichText } from './InlineDetail';
import type { DetailKind } from './InlineDetail';
import type { CSSProperties } from 'react';

const steps:[string,string,DetailKind,string][]=[
 ['Understand the problem','What needs to work, and who needs it?','compass','#e4c16a'],
 ['Find the signal','Look closely at the data and the people.','people','#a2c6e4'],
 ['Make a small version','Test the idea before growing the system.','code','#e2ad99'],
 ['Go deeper','Study the edge cases and the real constraints.','atom','#c5afe7'],
 ['Build, test, repeat','Make the useful version more dependable.','chip','#a9cdb0'],
 ['Ship with care','Connect the details and put it in people’s hands.','rocket','#e4c16a'],
 ['Keep learning','Watch what happens. Find the next question.','spark','#a2c6e4'],
];
export default function WorkingProcess(){return <section id="process" data-section className="fn-section fn-reveal process-section"><div className="process-intro"><span className="section-kicker">✺ HOW I WORK</span><h2>Start with a <InlineDetail kind="compass"/> question.<br/><span className="scribble">Follow it somewhere useful.</span></h2><p><RichText text="From AI tools to community platforms, this is how I turn curiosity into something people can use."/></p><CharacterSprite pose="code" className="process-character"/></div><div className="process-viewport"><div className="process-path"><svg viewBox="0 0 1000 170" preserveAspectRatio="none" aria-hidden="true"><path d="M0 80Q35 210 80 120T240 80 400 80 560 80 720 80 880 80 1000 80" fill="none" stroke="#5d809055" strokeWidth="5" strokeLinecap="round" pathLength="1"/></svg>{steps.map(([title,text,kind,color])=><article key={title} className="process-step" style={{'--dot':color} as CSSProperties}><InlineDetail kind={kind}/><i/><strong>{title}</strong><p>{text}</p></article>)}</div></div></section>;}
