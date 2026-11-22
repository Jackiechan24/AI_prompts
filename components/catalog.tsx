'use client';
import {Pagination} from './pagination';
import Link from 'next/link';
import {CategoryArtwork} from './category-artwork';
import {UISelect} from './ui-select';
import {useEffect,useState,useSyncExternalStore} from 'react';
import {QiSearchAi,QiBookmarkCheck,QiFire} from 'qingicon-react';
import {OutcomePreview} from './outcome-preview';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useStore } from './provider';
import { search } from '@/lib/search';
import cardSummaries from '@/data/card-summaries.json';
const compactPain:Record<string,string>=cardSummaries;
import type { Solution } from '@/types/solution';
export function Favorite({ id }: {
    id: string;
}) { const store = useStore(); const yes = store.favorites.includes(id); const [notice,setNotice]=useState('');useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),2200);return ()=>clearTimeout(timer);},[notice]);return <span className="favorite-control"><button type="button" className="favorite" aria-label={yes ? '取消收藏' : '收藏提示词'} aria-pressed={yes} title={yes ? '取消收藏' : '收藏提示词'} onClick={()=>{store.toggle(id);setNotice(yes?'已取消收藏':'已收藏');}}><QiBookmarkCheck size={24} variant="line" aria-hidden="true"/></button><span className="favorite-notice" role="status" aria-live="polite">{notice}</span></span>; }

function sampleHeat(id:string){let hash=0;for(const char of id)hash=(hash*31+char.charCodeAt(0))%9001;return ((1000+hash)/1000).toFixed(1);}
export function Card({ solution: s }: {
    solution: Solution;
}) {
    const href = '/solutions/' + s.slug;
    return (
        <article className="card scenario-card scenario-card-pilot" data-domain={s.domain}>
            <div className="scenario-card-image">
                <Link className="card-preview-link" href={href} tabIndex={-1} aria-hidden="true">
                    <OutcomePreview solution={s} small/>
                </Link>
                <div className="scenario-card-labels"><span className="scene-tag" aria-label={'场景：' + s.category}>{s.category}</span></div><div className="scenario-heat" aria-label={'示例热度 '+sampleHeat(s.id)+'k，非真实使用统计'} title="示例热度，非真实使用统计"><QiFire size={24} variant="line" aria-hidden="true"/><span>{sampleHeat(s.id)}k</span></div>
            </div>
            <div className="scenario-card-body">
                <h3><Link href={href}>{s.title}</Link></h3>
                <p className="card-summary">{compactPain[s.slug] ?? s.problem}</p>
                <Link className="scenario-card-action" href={href}>查看详情</Link>
            </div>
        </article>
    );
}

export function Grid({ items }: {
    items: Solution[];
}) { return items.length ? <div className="grid">{items.map(s => <Card key={s.id} solution={s}/>)}</div> : <div className="empty"><h3>这里还没有相关提示词</h3><p>试试其他关键词，或清除筛选条件。</p><Link href="/solutions">浏览全部提示词 →</Link></div>; }
function subscribeCatalogViewport(onChange:()=>void){const media=window.matchMedia('(max-width:700px)');media.addEventListener('change',onChange);return ()=>media.removeEventListener('change',onChange);}
function catalogMobileSnapshot(){return window.matchMedia('(max-width:700px)').matches;}
function catalogServerSnapshot(){return false;}
export function Catalog({ home = false, categorySlug }: {
    home?: boolean;
    categorySlug?: string;
}) {
    const store = useStore();
    const categories=store.categories;
    const isMobile=useSyncExternalStore(subscribeCatalogViewport,catalogMobileSnapshot,catalogServerSnapshot);
    const pageSize=isMobile?8:9;
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const category = categories.find(c => c.slug === categorySlug);
    if (!store.ready)
        return <section className="empty" role="status"><h2>正在载入方案</h2><p>请稍候…</p></section>;
    if (categorySlug && !category)
        return <div className="empty"><h1>404 · 分类不存在</h1><Link href="/categories">返回分类</Link></div>;
    const visible = store.solutions.filter(s => s.qualityStatus !== 'deprecated' && (process.env.NEXT_PUBLIC_CONTENT_MODE === 'production' ? s.qualityStatus === 'published' : s.isDemo));
    const clean = new URLSearchParams(params.toString());
    clean.delete('taskType');
    if(category) clean.set('domain',category.name);
    const domains=categories;
    if(clean.get('domain')&&!domains.some(c=>c.name===clean.get('domain'))) clean.delete('domain');
    if(!clean.get('domain')&&clean.get('category')){const owner=categories.find(c=>c.scenes.includes(clean.get('category')!));if(owner)clean.set('domain',owner.name);}
    const scene=categories.find(c=>c.name===clean.get('domain'));
    const tasks=scene?.scenes??[];
    if(!tasks.includes(clean.get('category')??'')) clean.delete('category');
    const unknown:string[]=[];

    const items = search(visible, clean);
    const totalPages=Math.max(1,Math.ceil(items.length/pageSize));
    const requestedPage=Number(clean.get('page')??1);
    const currentPage=Math.min(totalPages,Number.isSafeInteger(requestedPage)&&requestedPage>0?requestedPage:1);
    const pageItems=items.slice((currentPage-1)*pageSize,currentPage*pageSize);
    function goPage(page:number){const next=new URLSearchParams(clean.toString());if(page===1)next.delete('page');else next.set('page',String(page));router.push(pathname+'?'+next+'#catalog-results');}
    function update(k: string, v: string) { const next = new URLSearchParams(clean.toString()); next.delete('page'); if(k==='domain') next.delete('category'); if (v)
        next.set(k, v);
    else
        next.delete(k); router.push(pathname + '?' + next); }
    return <>{home ? <section className="hero home-discovery"><div className="hero-message"><h1><span>把你的需求，</span><span className="hero-title-ending">变成完整提示词。</span></h1><SearchForm/></div></section> : <section className="page-heading"><span className="eyebrow">提示词库</span><h1>{category?.name ?? (pathname === '/search' ? '搜索结果' : '找到适合你的提示词')}</h1><p>{category?.description ?? '把复杂任务变成清楚的步骤，把想法变成可用的结果。'}</p><SearchForm /></section>}
    <div className="section-heading" id="catalog-results"><h2>{home ? '找到适合任务的提示词' : '提示词列表'}</h2><span className="muted">{items.length} 条提示词</span></div><section className="catalog-filterbar" aria-label="提示词筛选"><div className="catalog-filter-fields"><div className="catalog-filter-field"><span id="catalog-domain-label">核心场景</span><UISelect ariaLabel="筛选核心场景" value={clean.get('domain')??''} disabled={!!category} options={[{value:'',label:'全部场景'},...domains.map(c=>({value:c.name,label:c.name}))]} onChange={value=>update('domain',value)}/></div><div className="catalog-filter-field"><span id="catalog-category-label">类别</span><UISelect ariaLabel="筛选类别" value={clean.get('category')??''} disabled={!scene} options={scene?[{value:'',label:'全部类别'},...tasks.map(name=>({value:name,label:name}))]:[{value:'',label:'先选择场景'}]} onChange={value=>update('category',value)}/></div></div>{(clean.get('category')||(!category&&clean.get('domain')))&&<button className="catalog-filter-clear" type="button" onClick={()=>{const next=new URLSearchParams(clean.toString());next.delete('category');next.delete('page');if(!category)next.delete('domain');router.push(pathname+(next.size?'?'+next.toString():''));}}>重置筛选</button>}</section>{unknown.length > 0 && <p role="status">已忽略无效筛选：{unknown.join('、')}</p>}<Grid items={pageItems}/>{totalPages>1&&<Pagination page={currentPage} pages={totalPages} total={items.length} onChange={goPage} label="提示词分页"/>}{home&&<section className="usage-flow" aria-label="提示词使用流程"><ol>{[['选场景','找到要完成的任务。'],['看模板','了解方法与交付效果。'],['填需求','补齐目标、材料和要求。'],['复制使用','附上材料，发送给 AI。']].map(([title,description],index)=><li key={title}><span className="usage-flow-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol></section>}</>;
}
function SearchForm() { const params = useSearchParams(); return <form className="search" action="/"><label className="sr-only" htmlFor="query">搜索任务</label><input id="query" name="q" defaultValue={params.get('q') ?? ''} key={params.get('q')} placeholder="输入你的需求任务"/>{['domain','category'].map(key=>params.get(key)?<input key={key} type="hidden" name={key} value={params.get(key)!}/>:null)}<button className="primary"><QiSearchAi size={18} aria-hidden="true"/>查找提示词</button></form>; }
export function Categories(){const store=useStore();const [page,setPage]=useState(1);const mobile=useSyncExternalStore(subscribeCatalogViewport,catalogMobileSnapshot,catalogServerSnapshot);const categoryPageSize=mobile?6:9;const categories=store.categories;if(!store.ready)return <p role="status">正在载入场景…</p>;const visible=store.solutions.filter(s=>s.qualityStatus!=='deprecated'&&(process.env.NEXT_PUBLIC_CONTENT_MODE==='production'?s.qualityStatus==='published':s.isDemo));const domains=categories.map(c=>({...c,items:visible.filter(s=>s.domain===c.name||s.relatedDomains?.includes(c.name))}));const pages=Math.max(1,Math.ceil(domains.length/categoryPageSize));const current=Math.min(page,pages);return <><section className="page-heading"><h1>场景分类</h1><p>选择核心场景，再按场景找到适合的提示词。</p></section>{!domains.length?<Grid items={[]}/>:<div className="grid categories-grid">{domains.slice((current-1)*categoryPageSize,current*categoryPageSize).map(c=><article className="card domain-card" data-domain={c.name} key={c.slug}><header className="domain-card-heading"><div className="domain-card-title"><h2><Link href={'/categories/'+c.slug}>{c.name}</Link></h2><span className="eyebrow">{c.items.length} 条提示词</span></div><div className="domain-art"><CategoryArtwork domain={c.name}/></div></header><div className="outcomes">{c.scenes.map(type=><Link key={type} href={'/categories/'+c.slug+'?category='+encodeURIComponent(type!)}>{type}</Link>)}</div></article>)}</div>}{domains.length>categoryPageSize&&<Pagination page={current} pages={pages} total={domains.length} onChange={value=>{setPage(value);window.scrollTo({top:0,behavior:"smooth"});}} label="场景分类分页"/>}</>;}
export {Mine} from './mine';








