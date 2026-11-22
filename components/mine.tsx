 'use client';
import {Pagination} from './pagination';
import {useState} from 'react';
import {useStore} from './provider';
import {Grid} from './catalog';
import {PromptWorkspace} from './prompt-workspace';
export function Mine(){const store=useStore();const [tab,setTab]=useState('created'),[page,setPage]=useState(1);if(!store.ready)return <p role="status">正在载入我的提示词…</p>;const available=store.solutions.filter(s=>s.qualityStatus!=='deprecated');const items=tab==='favorites'?available.filter(s=>store.favorites.includes(s.id)):store.recent.flatMap(r=>available.filter(s=>s.id===r.id));const pages=Math.max(1,Math.ceil(items.length/6)),current=Math.min(page,pages);return <><section className="page-heading workspace-heading"><h1>我的提示词</h1><p>保存提示词，随时编辑和复制使用。</p></section><div className="workspace-tabs" role="group" aria-label="我的提示词类型">{[['created','我创建的'],['favorites','我收藏的'],['recent','最近使用']].map(([key,title])=><button key={key} aria-pressed={tab===key} onClick={()=>{setTab(key);setPage(1);}}>{title}</button>)}</div><div hidden={tab!=='created'}><PromptWorkspace/></div>{tab!=='created'&&<><Grid items={items.slice((current-1)*6,current*6)}/>{items.length>6&&<Pagination page={current} pages={pages} total={items.length} onChange={setPage} label={tab==='favorites'?'我的收藏分页':'最近使用分页'}/>}</>}</>}

