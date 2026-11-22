 'use client';
import {selectPrompt} from '@/lib/prompt';
import {promptFrameworks} from '@/data/prompt-frameworks';
import {ExampleComparison} from './example-comparison';
import {TaskResult} from './task-result';
import {render} from '@/lib/template';
import type {Solution,WorkedExample,Variable} from '@/types/solution';
function DataTable({headers,rows,caption}:{headers:string[];rows:string[][];caption:string}){return <div className="table-scroll" tabIndex={0} aria-label={caption+'，可横向滚动'}><table><caption>{caption}</caption><thead><tr>{headers.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}
export function WorkedCase({data:c,template,variables,slug,variants}:{variants?:Solution['promptVariants'];data:WorkedExample;template:string;variables:Variable[];slug:string}){
 const prompt=render(selectPrompt({solutionContent:template,promptVariants:variants},c.values).content,variables,c.values);
 return <div className="worked-case"><ExampleComparison framework={promptFrameworks[slug]?.name} prompt={prompt.text}
 result={<><TaskResult slug={slug} data={c}/>{c.sections?.map(part=><section className="case-deliverable" key={part.title}><h3>{part.title}</h3><DataTable caption={part.title} headers={part.headers} rows={part.rows}/></section>)}</>}
 source={<><p>{c.background}</p><DataTable caption="示例输入材料" headers={c.inputHeaders} rows={c.inputs}/><h3>案例要求</h3><dl>{variables.map(v=><div key={v.key}><dt>{v.label}</dt><dd>{c.values[v.key]}</dd></div>)}</dl></>}
 explanation={<><p>{c.logic}</p><ul>{c.checks.map(t=><li key={t}>{t}</li>)}</ul></>}/></div>;
}
