import type {WorkedExample} from '@/types/solution';
import presentations from '@/data/scenario-presentations.json';
const scenes:Record<string,{view:string;scene:string;title:string;finding:string}>=presentations;
export function hasScenarioResult(slug:string){return !!scenes[slug];}
export function ScenarioResult({slug,data:c}:{slug:string;data:WorkedExample}){
 const meta=scenes[slug];
 if(!meta)return null;
 const tabular=['table','comparison','chart'].includes(meta.view);
 return <article className={'scenario-result scenario-'+meta.view}><div className="artifact-heading"><span>{meta.scene} / 示例结果</span><h3>{c.title}</h3></div>{meta.view==='chart'&&<div className="scenario-chart" aria-label="渠道订单数条形图">{c.rows.map(r=><div key={r[0]}><span>{r[0]}</span><i style={{width:Number(r[1])/12*65+'%'}}/><strong>{r[1]} 单</strong></div>)}</div>}{tabular?<div className="table-scroll" tabIndex={0} aria-label={meta.scene+'结果表，可横向滚动'}><table><caption>{meta.scene}交付明细</caption><thead><tr>{c.headers.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{c.rows.map((r,i)=><tr key={i}>{r.map((v,j)=><td key={j}>{v}</td>)}</tr>)}</tbody></table></div>:meta.view==='code'?<div className="scenario-code">{c.rows.map(r=><section key={r[0]}><h4>{r[0]}</h4><pre>{r[1]}</pre></section>)}</div>:<div className="scenario-sections">{c.rows.map((r,i)=><section key={i}>{['timeline','tree','board'].includes(meta.view)&&<span className="scenario-step">{String(i+1).padStart(2,'0')}</span>}<div><h4>{r[0]}</h4>{r.slice(1).map((cell,j)=><p key={j}>{c.headers.length>2&&<b>{c.headers[j+1]}： </b>}{cell}</p>)}</div></section>)}</div>}<div className="scenario-check"><strong>结果核对</strong><p>{meta.finding}</p></div></article>;
}
