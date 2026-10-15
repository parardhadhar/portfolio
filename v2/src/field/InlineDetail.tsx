import { Atom, Braces, CircuitBoard, Compass, Heart, MapPin, Mountain, Rocket, Sparkles, Users } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

const icons={atom:Atom,code:Braces,chip:CircuitBoard,compass:Compass,heart:Heart,pin:MapPin,mountain:Mountain,rocket:Rocket,spark:Sparkles,people:Users};
export type DetailKind=keyof typeof icons;
export function InlineDetail({kind='spark',children}:{kind?:DetailKind;children?:ReactNode}){
 const Icon=icons[kind];
 return <span className={`text-detail detail-${kind}`} aria-hidden="true"><Icon/>{children}</span>;
}
const words:Record<string,DetailKind>={'curiosity':'compass','mountains':'mountain','mountain':'mountain','Siliguri':'mountain','Bhopal':'pin','Bangalore':'atom','Bengaluru':'atom','AI':'chip','code':'code','build':'rocket','building':'code','people':'people','community':'people','ideas':'spark','music':'heart','useful':'rocket'};
export function RichText({text,animated=false}:{text:string;animated?:boolean}){
 let count=0;
 return <>{text.split(/(\s+)/).map((word,i)=>{
  const clean=word.replace(/[^\p{L}]/gu,'');const kind=words[clean]||words[clean.toLowerCase()];
  const show=kind&&count++<3;
  return <span key={i} className={animated&&word.trim()?'rich-word':undefined} style={{'--word':i/2} as CSSProperties}>{word}{show&&<InlineDetail kind={kind}/>}</span>;
 })}</>;
}

