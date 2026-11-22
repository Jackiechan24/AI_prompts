'use client';
import {useLayoutEffect,useRef,type ReactNode} from 'react';
import {RedesignedScene,redesignedScenes} from './redesigned-scene';
import {promptFrameworks} from '@/data/prompt-frameworks';
const sceneNames:Record<string,string>={"action-item-extraction": "行动事项", "batch-organization": "批量整理", "business-report-ppt-outline": "PPT 策划", "communication-preparation": "沟通准备", "competitor-analysis": "竞品分析", "content-writing": "内容创作", "customer-issue-triage": "客户问题整理", "customer-review-analysis": "评价分析", "data-chart-design": "图表制作", "document-drafting": "文档起草", "document-summary": "摘要提取", "email-reply": "邮件回复", "event-planning": "活动策划", "excel-data-cleaning": "数据清洗", "excel-multi-sheet-merge": "多表合并", "excel-sales-analysis": "销售分析", "file-archiving": "文件归档", "format-conversion": "格式转换", "industry-research": "行业研究", "information-retrieval": "资料检索", "marketing-copy": "营销文案", "meeting-notes-action-items": "会议纪要", "operation-guide": "操作指南", "process-mapping": "流程梳理", "project-planning": "项目规划", "proposal-quotation": "方案报价", "report-content-organization": "汇报内容组织", "sales-follow-up": "销售跟进", "speech-writing": "演讲稿", "text-rewriting": "改写润色", "xiaohongshu-topic-planning": "账号选题"};
const blue='#0071e3',ink='#1d1d1f',muted='#b8c8da',line='#dce5ef',mint='#dceee7',pale='#eaf3ff',amber='#e8a34c';
function Label({x,y,children,size=14,color=ink}:{x:number;y:number;children:ReactNode;size?:number;color?:string}) {
 return <text x={x} y={y} fontSize={size>=24?32:size===18?18:14} fontWeight={size>=24?700:600} fill={color}>{children}</text>;
}

function Paper({x,y,w=130,h=120,children,fill='#fff'}:{x:number;y:number;w?:number;h?:number;children?:ReactNode;fill?:string}){return <g><rect className="scene-ui-panel" data-surface={w>=260?'canvas':'paper'} x={x} y={y} width={w} height={h} rx="14" fill={fill} stroke={line}/>{children}</g>}
function Bars({x,y,widths=[78,104,62],color=muted}:{x:number;y:number;widths?:number[];color?:string}){return <g>{widths.map((w,i)=><rect key={i} x={x} y={y+i*13} width={w} height="5" rx="2.5" fill={color}/>)}</g>}
function Check({x,y,color=blue}:{x:number;y:number;color?:string}){return <path d={`m${x} ${y} 5 5 10-12`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>}
function Arrow({x,y,down=false}:{x:number;y:number;down?:boolean}){return <path d={down?`M${x} ${y}v22m-5-5 5 5 5-5`:`M${x} ${y}h26m-6-5 6 5-6 5`} stroke={blue} strokeWidth="2" fill="none" strokeLinecap="round"/>}
function Table({x,y,w=112,rows=3,accent=blue}:{x:number;y:number;w?:number;rows?:number;accent?:string}) {
 return <Paper x={x} y={y} w={w} h={24+rows*20}>
  <rect x={x+1} y={y+1} width={w-2} height="22" rx="10" fill={accent} opacity=".15"/>
  <rect x={x+12} y={y+10} width={w*.32} height="5" rx="2" fill={accent}/>
  <rect x={x+w*.64} y={y+10} width={w*.2} height="5" rx="2" fill={accent}/>
  {Array.from({length:rows},(_,i)=><g key={i}>
   <path d={`M${x+10} ${y+27+i*20}h${w-20}`} stroke={line}/>
   <rect x={x+12} y={y+34+i*20} width={w*.32} height="5" rx="2" fill={muted}/>
   <rect x={x+w*.64} y={y+34+i*20} width={w*.2} height="5" rx="2" fill={accent} opacity=".5"/>
  </g>)}
 </Paper>;
}

function Document({x=105,y=52,kind='draft'}:{x?:number;y?:number;kind?:string}) {
 return <Paper x={x} y={y} w={140} h={153}>
  <rect x={x+16} y={y+18} width="65" height="8" rx="4" fill={blue}/>
  <Bars x={x+16} y={y+42} widths={[107,88,102,75,96,61]}/>
  {kind==='summary'&&<Check x={x+102} y={y+131}/>}
 </Paper>;
}

function Nodes({loop=false}:{loop?:boolean}){return <><path d="M69 111h223" stroke={line} strokeWidth="3"/>{[38,145,252].map((x,i)=><g key={x}><rect x={x} y="82" width="70" height="58" rx="14" fill={i===1?blue:pale} stroke={i===1?blue:line}/>{i===2?<Check x={x+26} y={111}/>:<Bars x={x+17} y={103} widths={[36,25]} color={i===1?'#fff':muted}/>}</g>)}{loop&&<path d="M287 140v32H73v-25m-5 6 5-6 5 6" stroke={amber} strokeWidth="2" fill="none"/>}</>}
export function SceneArtwork({slug}:{slug:string}){
 const subject=useRef<SVGGElement>(null);
 useLayoutEffect(()=>{const node=subject.current;if(!node)return;if(redesignedScenes.has(slug)){node.removeAttribute('transform');return;}const box=node.getBBox();if(!box.width||!box.height)return;const uniform=Math.min(280/box.width,160/box.height);const sx=uniform,sy=uniform;const x=180-(box.x+box.width/2)*sx,y=128-(box.y+box.height/2)*sy;node.setAttribute('transform',`translate(${x} ${y}) scale(${sx} ${sy})`);},[slug]);

 if(!promptFrameworks[slug])return null;
 let art:ReactNode;
 switch(slug){
 case 'business-report-ppt-outline':
  art = (
   <>
 <Paper x={78} y={44} w={230} h={142} fill={pale}/>
 <Paper x={52} y={58} w={240} h={144}>
  <Label x={70} y={86} color={blue}>结论页</Label>
  <Label x={70} y={144} size={40} color={blue}>90%</Label>
  <rect x="188" y="105" width="82" height="16" rx="6" fill={blue}/>
  <rect x="188" y="134" width="55" height="16" rx="6" fill={amber}/>
  <Bars x={70} y={176} widths={[98,66]}/>
 </Paper>
</>
  );
  break;
 case 'customer-review-analysis':
  art = (
   <Paper x={36} y={48} w={288} h={160}>
 <circle cx="113" cy="125" r="41" fill="none" stroke={pale} strokeWidth="17"/>
 <circle cx="113" cy="125" r="41" fill="none" stroke={amber} strokeWidth="17" strokeDasharray="129 258" transform="rotate(-90 113 125)"/>
 <Label x={91} y={134} size={24} color={blue}>2:2</Label>
 <rect x="184" y="78" width="122" height="99" rx="10" fill={pale}/>
 <circle cx="201" cy="98" r="5" fill={amber}/>
 <Label x={212} y={103} size={12}>优先核查</Label>
 <Bars x={199} y={124} widths={[89,65,78]}/>
</Paper>
  );
  break;
 case 'excel-multi-sheet-merge':
  art = (
   <>
 <Table x={34} y={44} w={108} rows={2}/>
 <Table x={218} y={44} w={108} rows={2} accent={amber}/>
 <path d="M88 108v18h184v-18m-92 18v15" fill="none" stroke={blue} strokeWidth="2"/>
 <Paper x={70} y={142} w={220} h={70}>
  <rect x="71" y="143" width="218" height="24" rx="10" fill={pale}/>
  <Label x={86} y={159} size={12} color={blue}>统一总表</Label>
  <Label x={87} y={195} size={23} color={blue}>4 条</Label>
  <Bars x={174} y={183} widths={[86,60]}/><Check x={263} y={195} color="#28735b"/>
 </Paper>
</>
  );
  break;
 case 'excel-sales-analysis':
  art = (
   <Paper x={38} y={44} w={284} h={164}>
 <Label x={58} y={91} size={36} color={blue}>400</Label>
 <rect x="210" y="64" width="89" height="24" rx="12" fill={pale}/>
 <path d="m228 80 9-9 8 5 12-10" stroke={blue} strokeWidth="2" fill="none"/>
 <Label x={58} y={127} size={12}>线上</Label>
 <rect x="101" y="113" width="171" height="18" rx="6" fill={blue}/>
 <Label x={58} y={163} size={12}>线下</Label>
 <rect x="101" y="149" width="103" height="18" rx="6" fill={amber}/>
 <path d="M58 187h242" stroke={line}/>
</Paper>
  );
  break;
 case 'meeting-notes-action-items':
  art = (
   <Paper x={48} y={44} w={264} h={166}>
 <Label x={68} y={74} color={blue}>决策</Label>
 <rect x="120" y="59" width="172" height="25" rx="8" fill={pale}/><Check x={132} y={73} color="#28735b"/>
 <Bars x={158} y={68} widths={[111]}/>
 <path d="M68 99h224" stroke={line}/>
 <Label x={68} y={126} color={blue}>待办</Label>
 {[0,1].map(i=><g key={i}><rect x="120" y={110+i*39} width="16" height="16" rx="5" fill={pale} stroke={line}/><Bars x={147} y={116+i*39} widths={[127,80]}/><circle cx="281" cy={118+i*39} r="6" fill={i?amber:mint}/></g>)}
</Paper>
  );
  break;
 case 'speech-writing':
  art = (
   <Paper x={38} y={48} w={284} h={158}>
 <rect x="58" y="69" width="67" height="83" rx="12" fill={pale}/>
 <rect x="81" y="83" width="20" height="37" rx="10" fill={blue}/>
 <path d="M74 108v8a17 17 0 0 0 34 0v-8m-17 25v10m-11 0h22" stroke={blue} strokeWidth="2" fill="none"/>
 {[18,32,46,28,38,54,29,20].map((h,i)=><rect key={i} x={147+i*18} y={111-h/2} width="7" height={h} rx="3.5" fill={i<5?blue:muted}/>)}
 <Label x={147} y={174} size={23} color={blue}>2 min</Label>
</Paper>
  );
  break;
 case 'report-content-organization':
  art = (
   <Paper x={42} y={46} w={276} h={162}>
 <rect x="60" y="62" width="240" height="35" rx="9" fill={pale}/>
 <Label x={74} y={85} color={blue}>结论先行</Label><Check x={272} y={82}/>
 <Bars x={64} y={119} widths={[131,107,126]}/>
 <circle cx="257" cy="141" r="27" fill="none" stroke={pale} strokeWidth="9"/>
 <circle cx="257" cy="141" r="27" fill="none" stroke={blue} strokeWidth="9" strokeDasharray="136 170" transform="rotate(-90 257 141)"/>
</Paper>
  );
  break;
 case 'xiaohongshu-topic-planning':
  art = (
   <>
 {[0,1,2].map(i=><g key={i} transform={`rotate(${(i-1)*5} ${90+i*90} 129)`}>
  <Paper x={47+i*90} y={i===1?48:65} w={86} h={139} fill={i===1?pale:'#fff'}>
   <rect x={59+i*90} y={i===1?61:78} width="62" height="52" rx="9" fill={i===1?blue:mint}/>
   <circle cx={90+i*90} cy={i===1?86:103} r="12" fill={i===1?'#fff':amber}/>
   <Bars x={59+i*90} y={i===1?129:146} widths={[61,45,52]}/>
  </Paper>
 </g>)}
</>
  );
  break;
 case 'excel-data-cleaning':
  art = (
   <>
 <Table x={33} y={59} w={112} rows={4}/><Arrow x={165} y={125}/>
 <Table x={216} y={59} w={112} rows={4}/>
 <rect x="46" y="115" width="86" height="14" rx="4" fill={amber} opacity=".32"/>
 <rect x="46" y="136" width="86" height="14" rx="4" fill={amber} opacity=".32"/>
 <circle cx="307" cy="65" r="17" fill={mint}/><Check x={300} y={67} color="#28735b"/>
<Label x={216} y={49} size={12} color={blue}>异常核对</Label></>
  );
  break;
 case 'data-chart-design':
  art = (
   <Paper x={36} y={45} w={288} h={164}>
 <rect x="54" y="63" width="91" height="23" rx="8" fill={pale}/>
 <rect x="153" y="63" width="45" height="23" rx="8" fill={mint}/>
 <path d="M58 103v83h237" stroke={line} strokeWidth="2"/>
 {[68,45,31].map((h,i)=><rect key={i} x={82+i*70} y={185-h} width="37" height={h} rx="7" fill={i===0?blue:i===1?amber:muted}/>)}
 <path d="m78 136 70-34 71 14 65-19" stroke={blue} strokeWidth="2" fill="none"/>
<Label x={217} y={80} size={12} color={blue}>对比</Label></Paper>
  );
  break;
 case 'document-drafting':
  art = (
   <>
 <Paper x={92} y={42} w={158} h={158} fill={pale}/>
 <Paper x={108} y={54} w={158} h={158}>
  <Label x={126} y={84} color={blue}>工作文档</Label>
  <Bars x={126} y={104} widths={[118,96,118,83]}/>
  <rect x="126" y="166" width="85" height="23" rx="7" fill={pale}/><Check x={140} y={178}/>
 </Paper>
 <path d="m238 170 39-39 11 11-39 39-17 6Z" fill={blue}/>
</>
  );
  break;
 case 'text-rewriting':
  art = (
   <>
 <Paper x={34} y={56} w={115} h={141}><Bars x={49} y={77} widths={[84,65,81,75,52,79,60]}/></Paper>
 <Arrow x={166} y={123}/>
 <Paper x={216} y={56} w={115} h={141}>
  <rect x="228" y="71" width="91" height="28" rx="8" fill={pale}/><Bars x={239} y={82} widths={[66]} color={blue}/>
  <Bars x={231} y={116} widths={[82,66,77]}/><Check x={262} y={177} color="#28735b"/>
 </Paper>
<Label x={218} y={48} size={12} color={blue}>精简表达</Label></>
  );
  break;
 case 'document-summary':
  art = (
   <>
 <Document x={40} y={48} kind="source"/>
 <Paper x={201} y={78} w={119} h={118}>
  <Label x={216} y={105} size={14} color={blue}>重点摘要</Label>
  {[0,1,2].map(i=><g key={i}><circle cx="220" cy={126+i*22} r="4" fill={blue}/><rect x="232" y={123+i*22} width={69-i*9} height="6" rx="3" fill={muted}/></g>)}
 </Paper>
</>
  );
  break;
 case 'format-conversion':
  art = (
   <>
 <Table x={35} y={63} w={111} rows={4}/><Arrow x={165} y={124}/>
 <Paper x={215} y={59} w={113} h={141} fill={pale}>
  <Label x={234} y={102} size={28} color={blue}>{'{ }'}</Label>
  <Bars x={233} y={123} widths={[75,52,65]} color={blue}/>
  <Check x={259} y={179} color="#28735b"/>
 </Paper>
</>
  );
  break;
 case 'action-item-extraction':
  art=<>
   <Paper x={38} y={44} w={284} h={76}>
    <circle cx="76" cy="82" r="19" fill="#16866e"/><path d="m66 82 7 7 14-16" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <Label x={110} y={77} size={18}>整理清单</Label><rect x="110" y="91" width="122" height="8" rx="4" fill={muted}/><circle cx="283" cy="82" r="14" fill={pale}/>
   </Paper>
   <Paper x={38} y={134} w={284} h={76}>
    <circle cx="76" cy="172" r="19" fill={amber}/><path d="M76 160v13l9 5" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <Label x={110} y={167} size={18}>安排测试</Label><rect x="110" y="181" width="94" height="8" rx="4" fill={muted}/><circle cx="283" cy="172" r="14" fill={pale}/>
   </Paper>
  </>;break;

 case 'email-reply':
  art = (
   <>
 <Paper x={48} y={60} w={264} h={144} fill={pale}>
  <path d="m50 78 130 91L310 78" stroke={muted} strokeWidth="2" fill="none"/>
 </Paper>
 <Paper x={83} y={44} w={194} h={112}>
  <Label x={102} y={73} color={blue}>回复草稿</Label><Bars x={102} y={94} widths={[151,132,104]}/>
 </Paper>
 <circle cx="286" cy="179" r="22" fill={blue}/><path d="m276 179 8-8m-8 8h18m-18 0 8 8" stroke="#fff" strokeWidth="2" fill="none"/>
</>
  );
  break;
 case 'communication-preparation':
  art = (
   <>
 <Paper x={34} y={54} w={216} h={74} fill={pale}>
  <Label x={52} y={81} color={blue}>确认优先级</Label><Bars x={52} y={100} widths={[164]}/>
 </Paper>
 <path d="m62 126-11 13 32-13" fill={pale}/>
 <Paper x={120} y={139} w={206} h={63}>
  <Check x={139} y={168} color="#28735b"/><Bars x={171} y={158} widths={[133,91]}/>
 </Paper>
</>
  );
  break;
 case 'content-writing':
  art = (
   <>
 <Paper x={88} y={44} w={185} h={165}>
  <rect x="106" y="62" width="149" height="45" rx="9" fill={pale}/>
  <Label x={120} y={91} color={blue}>完整正文</Label>
  <Bars x={107} y={123} widths={[147,131,146,97]}/>
  <rect x="107" y="180" width="63" height="9" rx="4" fill={blue}/>
 </Paper>
 <circle cx="73" cy="95" r="25" fill={pale}/><path d="M63 103V88h9v8h-5v7m11 0V88h9v8h-5v7" fill={blue}/>
 <circle cx="284" cy="173" r="24" fill={mint}/><Check x={277} y={175} color="#28735b"/>
</>
  );
  break;
 case 'marketing-copy':
  art = (
   <>
 <Paper x={37} y={52} w={130} h={147} fill={pale}>
  <path d="M76 84h52l9 82H67Z" fill="#fff" stroke={line}/>
  <path d="M88 86V74a14 14 0 0 1 28 0v12" stroke={blue} strokeWidth="2" fill="none"/>
  <circle cx="103" cy="128" r="18" fill={amber}/>
 </Paper>
 <Paper x={181} y={67} w={142} h={117}>
  <Label x={199} y={97} color={blue}>用户价值</Label>
  <Bars x={199} y={118} widths={[105,83,96]}/>
  <rect x="199" y="162" width="58" height="7" rx="3" fill={blue}/>
 </Paper>
</>
  );
  break;
 case 'event-planning':
  art = (
   <Paper x={35} y={48} w={290} h={159}>
 <Label x={55} y={86} size={28} color={blue}>60 min</Label>
 <rect x="55" y="111" width="250" height="27" rx="9" fill={pale}/>
 <rect x="55" y="111" width="42" height="27" rx="9" fill={amber}/>
 <rect x="103" y="111" width="127" height="27" rx="9" fill={blue}/>
 {[72,166,282].map((x,i)=><g key={x}><path d={`M${x} 145v14`} stroke={line} strokeWidth="2"/><circle cx={x} cy="171" r="8" fill={i===1?blue:muted}/></g>)}
</Paper>
  );
  break;
 case 'customer-issue-triage':
  art = (
   <Paper x={34} y={49} w={292} h={159}>
 <rect x="49" y="65" width="117" height="124" rx="10" fill="#fff6e9"/>
 <rect x="194" y="65" width="117" height="124" rx="10" fill={pale}/>
 <Label x={69} y={91} size={14} color={amber}>待处理</Label>
 <Label x={214} y={91} size={14} color={blue}>已解决</Label>
 <Bars x={64} y={112} widths={[84,65,78]}/><Bars x={209} y={112} widths={[84,65,78]}/>
 <circle cx="143" cy="171" r="7" fill={amber}/><Check x={274} y={173} color="#28735b"/>
 <path d="M173 128h14m-4-4 4 4-4 4" stroke={blue} strokeWidth="2" fill="none"/>
</Paper>
  );
  break;
 case 'sales-follow-up':
  art = (
   <Paper x={34} y={52} w={292} h={153}>
 <path d="M72 111h216" stroke={line} strokeWidth="5"/><path d="M72 111h108" stroke={blue} strokeWidth="5"/>
 {[72,180,288].map((x,i)=><g key={x}><circle cx={x} cy="111" r="19" fill={i<2?blue:'#fff'} stroke={line}/>{i<2&&<Check x={x-7} y={113} color="#fff"/>}</g>)}
 <Label x={56} y={154} size={13}>接洽</Label><Label x={164} y={154} size={13}>试用</Label>
 <rect x="268" y="146" width="38" height="7" rx="3" fill={muted}/>
 <rect x="56" y="177" width="162" height="6" rx="3" fill={pale}/>
</Paper>
  );
  break;
 case 'proposal-quotation':
  art = (
   <Paper x={65} y={44} w={230} h={165}>
 <Label x={85} y={74} color={blue}>报价明细</Label>
 <path d="M85 88h190" stroke={line}/>
 <Bars x={85} y={103} widths={[119]}/><rect x="236" y="101" width="36" height="6" rx="3" fill={muted}/>
 <Label x={84} y={156} size={35} color={blue}>¥6,000</Label>
 <rect x="85" y="179" width="86" height="8" rx="4" fill={pale}/><circle cx="267" cy="183" r="6" fill={amber}/>
</Paper>
  );
  break;
 case 'information-retrieval':
  art = (
   <>
 <Paper x={51} y={47} w={199} h={159}>
  <Label x={70} y={77} color={blue}>来源依据</Label>
  <Bars x={70} y={98} widths={[157,131,149,112,141,89]}/>
 </Paper>
 <circle cx="267" cy="137" r="32" fill={pale} stroke={blue} strokeWidth="3"/>
 <path d="m290 161 23 25" stroke={blue} strokeWidth="8" strokeLinecap="round"/>
 <Check x={260} y={139} color="#28735b"/>
</>
  );
  break;
 case 'industry-research':
  art = (
   <>
 <Paper x={38} y={55} w={112} h={143}>
  <Bars x={54} y={76} widths={[76,59,73]}/>
  {[26,48,36].map((h,i)=><rect key={i} x={55+i*25} y={179-h} width="16" height={h} rx="4" fill={i===1?blue:muted}/>)}
 </Paper>
 <Paper x={170} y={55} w={153} h={143}>
  <Label x={188} y={83} color={blue}>趋势判断</Label>
  <path d="M190 169V105m0 64h112" stroke={line}/>
  <path d="m195 154 28-28 23 10 40-38" stroke={blue} strokeWidth="3" fill="none" strokeLinejoin="round"/>
  <circle cx="286" cy="98" r="5" fill={amber}/>
 </Paper>
</>
  );
  break;
 case 'competitor-analysis':
  art = (
   <Paper x={38} y={45} w={284} h={164}>
 <rect x="54" y="61" width="252" height="30" rx="9" fill={pale}/>
 <Label x={159} y={82} color={blue}>A</Label><Label x={258} y={82} color={blue}>B</Label>
 {[0,1,2].map(i=><g key={i}><rect x="58" y={111+i*29} width="65" height="6" rx="3" fill={muted}/><Check x={157} y={114+i*29}/>{i===1?<circle cx="264" cy={114+i*29} r="6" fill={amber}/>:<Check x={257} y={114+i*29} color="#28735b"/>}</g>)}
</Paper>
  );
  break;
 case 'project-planning':
  art = (
   <Paper x={34} y={46} w={292} h={163}>
 <Label x={54} y={75} color={blue}>阶段计划</Label>
 <path d="M94 91v94h211" stroke={line}/>
 {[0,1,2].map(i=><g key={i}><circle cx="69" cy={109+i*31} r="6" fill={muted}/><rect x={106+i*49} y={99+i*31} width="88" height="19" rx="6" fill={i===1?amber:i===2?muted:blue}/></g>)}
 <path d="M290 86v100" stroke={blue} strokeDasharray="4 5"/>
 <path d="m290 81 6 6-6 6-6-6Z" fill={blue}/>
</Paper>
  );
  break;
 case 'file-archiving':
  art = (
   <>
 <path d="M45 90V62q0-10 10-10h55l16 18h87v35H45" fill={pale} stroke={line}/>
 <path d="M55 94h128v90H55Z" fill={blue} opacity=".12"/>
 <Paper x={80} y={92} w={103} h={109}><Bars x={94} y={111} widths={[72,54,69]}/><Check x={121} y={179}/></Paper>
 <Paper x={213} y={80} w={101} h={121}>
  <rect x="228" y="96" width="68" height="21" rx="6" fill={pale}/>
  <Bars x={228} y={132} widths={[69,49,61]}/>
  <Label x={228} y={187} size={13} color={blue}>已归档</Label>
 </Paper>
</>
  );
  break;
 case 'batch-organization':
  art=<>
   <Paper x={34} y={59} w={93} h={143} fill={pale}/>
   <Paper x={45} y={46} w={93} h={143}>
    <rect x="61" y="68" width="43" height="10" rx="5" fill={blue}/><Bars x={61} y={98} widths={[59,48,59]} color={muted}/>
   </Paper>
   <path d="M157 124h43m-10-10 10 10-10 10" stroke={blue} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
   <Paper x={224} y={46} w={102} h={156} fill="#fff8ee">
    <path d="m275 69 28 48h-56Z" fill="#fff0da" stroke="#d98527" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M275 84v16" stroke="#d98527" strokeWidth="4" strokeLinecap="round"/><circle cx="275" cy="108" r="2" fill="#d98527"/>
    <text x="275" y="149" textAnchor="middle" fontSize="18" fontWeight="650" fill="#8f521c">重名冲突</text>
    <rect x="246" y="167" width="58" height="7" rx="3.5" fill="#dfbd91"/>
   </Paper>
  </>;break;

 case 'operation-guide':
  art = (
   <Paper x={33} y={50} w={294} h={155}>
 <path d="M86 111h190" stroke={line} strokeWidth="3"/>
 {[66,157,248].map((x,i)=><g key={x}>
  <rect x={x} y="82" width="48" height="58" rx="11" fill={i===1?blue:pale}/>
  {i===2?<Check x={x+15} y={112}/>:<Bars x={x+11} y={103} widths={[27,19]} color={i===1?'#fff':muted}/>}
 </g>)}
 <Label x={58} y={174} size={13}>准备</Label><Label x={155} y={174} size={13}>检查</Label>
</Paper>
  );
  break;
 case 'process-mapping':
  art = (
   <Paper x={32} y={50} w={296} h={157}>
 <path d="M102 111h36m84 0h36" stroke={blue} strokeWidth="2"/>
 <rect x="49" y="86" width="59" height="51" rx="11" fill={pale}/>
 <path d="m180 79 32 32-32 32-32-32Z" fill={blue}/>
 <rect x="253" y="86" width="59" height="51" rx="11" fill={pale}/>
 <Check x={274} y={112} color="#28735b"/>
 <Bars x={61} y={103} widths={[34,23]}/>
 <path d="M180 144v31H78v-28m-4 4 4-4 4 4" stroke={amber} strokeWidth="2" fill="none"/>
 <Label x={52} y={73} size={12}>提交</Label><Label x={165} y={73} size={12}>审批</Label>
</Paper>
  );
  break;
 default:art=<Nodes loop/>;
 }
 
 return <g data-artwork-kind={slug}><title>{sceneNames[slug]+'成果示例'}</title><desc>{promptFrameworks[slug].reason}</desc><g ref={subject} className="scene-subject">{redesignedScenes.has(slug)?<RedesignedScene slug={slug}/>:art}</g></g>;
}


