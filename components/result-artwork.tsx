import type {CSSProperties} from 'react';
import type {Solution} from '@/types/solution';
import {promptFrameworks} from '@/data/prompt-frameworks';
import {SceneArtwork} from './scene-artwork';
const palettes: Record<string, string[]> = {
 '演示与汇报':['#7655d8','#f0eaff','#e8b74d','#b9a7e8','#f8f5ff'],
 '数据与表格':['#13866b','#ddf4e9','#efad43','#8cbfae','#f0faf5'],
 '文档与写作':['#467ad2','#e5efff','#e99d6a','#a5bce3','#f3f7ff'],
 '会议与沟通':['#168da2','#def4f7','#edac57','#8ebfc9','#effafb'],
 '内容与营销':['#d85b88','#fce5ef','#9a78d6','#dca6bb','#fff4f8'],
 '客户与销售':['#d47731','#fff0da','#6ba78a','#dab895','#fff9f0'],
 '研究与规划':['#6861c7','#eae8fc','#5caca8','#afa9d7','#f5f4fd'],
 '文件与流程':['#4b8193','#e2f0f4','#e3a255','#9dbac4','#f2f8fa'],
};
export function OutcomePreview({solution:s,small=false}:{solution:Solution;small?:boolean}){const colors=palettes[s.domain]??palettes['数据与表格'];const style={'--art-accent':colors[0],'--art-pale':colors[1],'--art-secondary':colors[2],'--art-muted':colors[3],'--art-bg':colors[4]} as CSSProperties;return <div style={style} data-scene={s.slug} className={'task-preview result-artwork '+(small?'task-preview-small':'')}><svg viewBox="0 0 360 240" role="img" aria-label={s.category+'：'+s.title+'成果示例'} preserveAspectRatio="xMidYMid meet">{promptFrameworks[s.slug]?<SceneArtwork slug={s.slug}/>:<g><rect width="360" height="220" fill="#fff"/><rect x="90" y="48" width="180" height="148" rx="14" fill="#fff" stroke="#dce5ef"/><rect x="112" y="70" width="74" height="8" rx="4" fill="#0071e3"/>{[0,1,2,3,4].map(i=><rect key={i} x="112" y={99+i*16} width={i%2?104:134} height="5" rx="2.5" fill="#b8c8da"/>)}</g>}</svg></div>}
