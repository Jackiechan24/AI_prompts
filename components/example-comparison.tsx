 'use client';
import {useId,useState,type ReactNode} from 'react';
import {PromptReading} from './prompt-reading';
import {Copy} from './copy';
export function ExampleComparison({result,prompt,template=false}:{result:ReactNode;prompt:string;source?:ReactNode;explanation?:ReactNode;framework?:string;template?:boolean}){
 const [tab,setTab]=useState<'result'|'prompt'>('result');const id=useId();
 return <div className="example-comparison"><div className="comparison-grid" data-active-panel={tab}><section id={id+'-result'} className="comparison-column comparison-result" aria-label="结果示例"><div className="comparison-column-heading"><h3>结果示例</h3></div><div className="comparison-result-content" tabIndex={0} aria-label="完整结果示例，可滚动查看">{result}</div></section><section id={id+'-prompt'} className="comparison-column comparison-prompt" aria-label="对应框架提示词"><div className="comparison-column-heading"><h3>{template?'提示词模板':'对应提示词'}</h3></div><div className="comparison-prompt-content prompt-reading" tabIndex={0} aria-label="案例提示词正文"><PromptReading text={prompt}/></div><div className="comparison-prompt-actions"><Copy text={prompt} label={template?'复制模板':'复制案例提示词'} variant="secondary"/></div></section></div><div className="comparison-mobile-tabs" role="group" aria-label="切换案例视图"><button type="button" aria-pressed={tab==='result'} aria-controls={id+'-result'} onClick={()=>setTab('result')}>结果示例</button><button type="button" aria-pressed={tab==='prompt'} aria-controls={id+'-prompt'} onClick={()=>setTab('prompt')}>对应提示词</button></div></div>;
}
