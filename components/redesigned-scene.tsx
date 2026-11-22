import type {ReactNode} from 'react';
const accent='#3478d4',soft='#e9f1fc',edge='#b7cbe3',text='#294663',green='#13876f';
export const redesignedScenes=new Set(['document-drafting','document-summary','email-reply','event-planning','excel-data-cleaning','excel-multi-sheet-merge','file-archiving','format-conversion']);
function Sheet({x,y,w,h,children}:{x:number;y:number;w:number;h:number;children?:ReactNode}){return <g><rect x={x} y={y} width={w} height={h} rx="12" fill="#fff" stroke={edge} strokeWidth="1.2"/>{children}</g>}
function Lines({x,y,widths}:{x:number;y:number;widths:number[]}){return <g>{widths.map((w,i)=><rect key={i} x={x} y={y+i*15} width={w} height="5" rx="2.5" fill={accent} opacity={i===0?.8:.45}/>)}</g>}
function Tick({x,y}:{x:number;y:number}){return <path d={`m${x} ${y} 6 6 12-14`} stroke={green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>}
function Flow({x,y}:{x:number;y:number}){return <path d={`M${x} ${y}h26m-7-6 7 6-7 6`} stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>}
function Caption({x,y,children}:{x:number;y:number;children:ReactNode}){return <text x={x} y={y} fontSize="16" fontWeight="600" fill={text}>{children}</text>}
function Grid({x,y,w=102,clean=false}:{x:number;y:number;w?:number;clean?:boolean}){return <Sheet x={x} y={y} w={w} h={112}><rect x={x+1} y={y+1} width={w-2} height="24" rx="11" fill={soft}/>{[0,1,2].map(i=><g key={i}><path d={`M${x+12} ${y+43+i*23}h${w-24}`} stroke={edge}/><rect x={x+12} y={y+34+i*23} width={w*.4} height="5" rx="2" fill={clean?green:accent} opacity=".65"/><circle cx={x+w-20} cy={y+36+i*23} r="3" fill={clean?green:i===1?'#eba846':accent}/></g>)}</Sheet>}
/** Compositions use a shared 280 × 160 drawing area, without runtime stretching. */
export function RedesignedScene({slug}:{slug:string}){
 switch(slug){
 case 'document-drafting':return <>
  <Sheet x={59} y={61} w={228} h={132}><rect x="60" y="62" width="51" height="130" rx="11" fill={soft}/><Lines x={73} y={85} widths={[23,23,17]}/><Caption x={128} y={89}>文档草稿</Caption><Lines x={128} y={110} widths={[135,119,130,89]}/></Sheet>
  <g transform="rotate(-40 279 165)"><rect x="270" y="111" width="15" height="82" rx="4" fill={accent}/><path d="m270 193 7.5 14 7.5-14" fill={text}/><path d="M272 125h11" stroke="#fff" strokeWidth="2"/></g>
 </>;
 case 'document-summary':return <>
  <Sheet x={42} y={49} w={113} h={158}><Lines x={57} y={70} widths={[79,70,79,63,76,68,48]}/><rect x="54" y="96" width="85" height="12" rx="4" fill="#ffe4a7" opacity=".6"/></Sheet><Flow x={166} y={128}/>
  <Sheet x={208} y={65} w={110} h={126}><Caption x={223} y={91}>摘要</Caption>{[0,1,2].map(i=><g key={i}><circle cx="226" cy={113+i*25} r="3.5" fill={accent}/><rect x="238" y={110+i*25} width={61-i*7} height="6" rx="3" fill={accent} opacity=".55"/></g>)}</Sheet>
 </>;
 case 'email-reply':return <>
  <rect x="49" y="91" width="262" height="110" rx="13" fill="#dff0f3" stroke="#90bdca" strokeWidth="1.2"/><path d="m51 101 129 83 129-83" stroke="#90bdca" strokeWidth="2" fill="none"/>
  <Sheet x={82} y={48} w={196} h={109}><Caption x={101} y={76}>回复</Caption><Lines x={101} y={94} widths={[151,131,101]}/><Tick x={244} y={135}/></Sheet>
 </>;
 case 'event-planning':return <>
  <Sheet x={43} y={52} w={274} h={151}><rect x="44" y="53" width="272" height="33" rx="12" fill="#fbe7f0"/><Caption x={62} y={76}>活动安排</Caption><path d="M84 125h192" stroke="#ddc9da" strokeWidth="3"/>{[84,180,276].map((x,i)=><g key={x}><circle cx={x} cy="125" r="12" fill={i===1?'#d9558b':'#e6bad0'}/>{i===0&&<path d="m79 125 4 4 7-9" stroke="#fff" strokeWidth="2" fill="none"/>}<rect x={x-23} y="151" width="46" height="6" rx="3" fill="#b77b9a"/><rect x={x-17} y="166" width="34" height="4" rx="2" fill="#dec2d2"/></g>)}</Sheet>
 </>;
 case 'excel-data-cleaning':return <>
  <Grid x={43} y={72}/><rect x="53" y="126" width="82" height="15" rx="4" fill="#ffd898" opacity=".8"/><Flow x={165} y={127}/><Grid x={215} y={72} clean/><circle cx="302" cy="68" r="17" fill="#d7f1e7" stroke="#b8dfd0"/><Tick x={294} y={69}/>
 </>;
 case 'excel-multi-sheet-merge':return <>
  {[48,213].map((x,i)=><Sheet key={x} x={x} y={49} w={99} h={63}><rect x={x+1} y="50" width="97" height="18" rx="10" fill={i?'#fff0d6':soft}/><Lines x={x+13} y={79} widths={[72,55]}/></Sheet>)}
  <path d="M98 113v17h165v-17m-83 17v17" stroke={green} strokeWidth="2" fill="none"/><Sheet x={70} y={149} w={220} h={59}><rect x="71" y="150" width="218" height="18" rx="10" fill="#dff2e9"/><Lines x={86} y={181} widths={[155]}/><Tick x={257} y={183}/></Sheet>
 </>;
 case 'file-archiving':return <>
  <path d="M56 83V67a12 12 0 0 1 12-12h69l19 20h135a12 12 0 0 1 12 12v103a13 13 0 0 1-13 13H69a13 13 0 0 1-13-13Z" fill="#e0edf3" stroke="#9fbccb" strokeWidth="1.3"/>
  <Sheet x={80} y={86} w={75} h={98}><Lines x={93} y={105} widths={[46,36,45]}/><Tick x={106} y={165}/></Sheet><Sheet x={169} y={86} w={109} h={98}><rect x="183" y="103" width="80" height="19" rx="5" fill={soft}/><Lines x={183} y={135} widths={[75,57]}/><Tick x={243} y={164}/></Sheet>
 </>;
 case 'format-conversion':return <>
  <Grid x={43} y={68}/><Flow x={165} y={125}/><Sheet x={213} y={49} w={105} h={158}><path d="M242 73h-7v29h-7m7 0v29h7m46-58h7v29h7m-7 0v29h-7" stroke={accent} strokeWidth="3" strokeLinecap="round" fill="none"/><Lines x={230} y={146} widths={[70,52]}/><Tick x={255} y={187}/></Sheet>
 </>;
 default:return null;
 }
}
