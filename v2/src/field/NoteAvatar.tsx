export default function NoteAvatar({kind='hello'}:{kind?:string}){
 let seed=2166136261;for(const char of kind)seed=Math.imul(seed^char.charCodeAt(0),16777619)>>>0;
 const next=(count:number)=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return (seed>>>8)%count;};
 const bg=['#8dcab4','#c6a8e5','#efb66e','#91bde0','#a5abd9','#e8a7a2','#dfcf84','#b3d69a'][next(8)];
 const shirt=['#3f796f','#785292','#ae6439','#486b9a','#576189','#a66466','#b46f34','#425749'][next(8)];
 const skin=['#f4d4b7','#e9b58c','#c88d67','#9b6349','#724b3d'][next(5)];
 const hair=['#292a33','#50372e','#794c35','#b07a42','#d3b38a','#51415c'][next(6)];
 const style=next(6),accessory=next(8),eyes=next(3),smile=next(3),blush=next(2);
 const cuts=['M16 29c-5-21 32-29 33 0l-9-12-7 5-9-3Z','M15 36V23c0-23 35-24 35 1v17l-5-3V21l-22 3-2 20-7-4Z','m15 25 1-9 5 1 3-9 7 5 6-7 5 9 6-2 3 16-7-8-7 3-8-4-7 6Z','M16 29V17c4-12 28-12 32 1v12l-7-13-20 4Z','M15 28c0-27 35-25 35 0l-7-11-5 2-6-5-8 5-4-1Z','M18 21q14-23 28 0l-6-3-9 2-7-2Z'];
 return <svg viewBox="0 0 64 64" role="img" aria-label="Randomly generated cartoon visitor avatar"><circle cx="32" cy="32" r="32" fill={bg}/><path d="M9 64c1-18 13-23 23-23s22 5 23 23" fill={shirt}/><path d="M26 42h12v9q-6 5-12 0" fill={skin}/><ellipse cx="32" cy="30" rx="16" ry="18" fill={skin}/><circle cx="16" cy="31" r="3" fill={skin}/><circle cx="48" cy="31" r="3" fill={skin}/><path d={cuts[style]} fill={hair}/>{style===3&&<circle cx="32" cy="8" r="8" fill={hair}/>}
 {eyes===1?<path d="m22 30 3-2 3 2m8 0 3-2 3 2" fill="none" stroke="#302e38" strokeWidth="1.8" strokeLinecap="round"/>:<g fill="#302e38"><ellipse cx="25" cy="30" rx="1.6" ry={eyes===0?1.6:2.2}/><ellipse cx="39" cy="30" rx="1.6" ry={eyes===0?1.6:2.2}/></g>}
 {smile===1?<path d="M26 37h12q-6 12-12 0" fill="#fff0db" stroke="#754b45" strokeWidth="1.2"/>:<path d={smile===0?'M27 38q5 5 10 0':'M29 39h6'} fill="none" stroke="#754b45" strokeWidth="2" strokeLinecap="round"/>}
 {blush===1&&<g fill="#e28f83" opacity=".45"><ellipse cx="21" cy="35" rx="3" ry="1.8"/><ellipse cx="43" cy="35" rx="3" ry="1.8"/></g>}
 {accessory===0&&<g fill="none" stroke="#454052" strokeWidth="2"><rect x="18" y="26" width="12" height="9" rx="3"/><rect x="34" y="26" width="12" height="9" rx="3"/><path d="M30 29h4"/></g>}
 {accessory===1&&<path d="M11 22h42l-9-9H22l-3 9" fill="#e8d39b"/>}
 {accessory===2&&<path d="M15 20c0-22 34-22 34 0Zm-2 0h38v6H13Z" fill={shirt}/>}
 {accessory===3&&<><path d="M13 30V23a19 19 0 0 1 38 0v7" fill="none" stroke="#f6e7ce" strokeWidth="4"/><rect x="10" y="26" width="7" height="14" rx="3" fill={shirt}/><rect x="47" y="26" width="7" height="14" rx="3" fill={shirt}/></>}
 {accessory===4&&<path d="m44 10 2 4 4 1-3 3 1 4-4-2-3 2 1-4-3-3 4-1Z" fill="#ffe795"/>}
 {accessory===5&&<path d="M25 36q7-8 14 0l-7-1Z" fill={hair}/>}
 {accessory===6&&<path d="m21 54 7 4-7 4m22-8-7 4 7 4" fill="none" stroke="#efdfac" strokeWidth="2"/>}
 </svg>;
}
