import './RestoredWorld.css';

export type CharacterPose = 'wave' | 'code' | 'study' | 'walk';
export default function CharacterSprite({pose='wave',className=''}:{pose?:CharacterPose;className?:string}){
 return <span className={`character-sprite pose-${pose} ${className}`} role="img" aria-label={`Parardha ${pose==='code'?'coding':pose==='study'?'studying':pose==='walk'?'walking':'waving'}`}/>;
}

