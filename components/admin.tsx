'use client';
import {Pagination} from './pagination';
import {WorkspaceDialog} from './workspace-dialog';
import {ConfirmDialog} from './confirm-dialog';
import {FeedbackToast} from './feedback-toast';
import {UISelect} from './ui-select';
import {SceneManager} from './scene-manager';
import {newPrompt} from '@/lib/new-prompt';
import { useState } from 'react';
import { useStore } from './provider';
import { builtin } from '@/lib/solutions';
import { validateSolution, transitionAllowed, criticalChanged } from '@/lib/validation';
import { download } from '@/lib/storage';
import { SolutionDetail } from './detail';
import type { Solution } from '@/types/solution';
export function Admin() { const [sceneToolbar,setSceneToolbar]=useState<HTMLDivElement|null>(null);
    const [deleteOpen,setDeleteOpen]=useState(false);
    const store = useStore();const categories=store.categories;
    const [area,setArea]=useState('prompts'),[creating,setCreating]=useState(false),[newTitle,setNewTitle]=useState(''),[newBody,setNewBody]=useState(''),[newScene,setNewScene]=useState('');
    const [query,setQuery]=useState(''),[page,setPage]=useState(1),[mode,setMode]=useState('basic');
    const [selected, setSelected] = useState<string | null>(null), [text, setText] = useState(''), [original, setOriginal] = useState(''), [revision, setRevision] = useState(0), [errors, setErrors] = useState<string[]>([]), [preview, setPreview] = useState<Solution | null>(null), [message, setMessage] = useState('');
    if (!store.ready)
        return <section className="empty" role="status"><h2>正在载入管理数据</h2><p>请稍候…</p></section>;
    function closeEditor(){if(text!==original&&!confirm('丢弃尚未保存的编辑？'))return;setSelected(null);setText('');setOriginal('');setErrors([]);setPreview(null);}
    function choose(s: Solution) { if (text !== original && !confirm('丢弃尚未保存的编辑？'))
        return; const value = s; const json = JSON.stringify(value, null, 2); setSelected(s?.id ?? null); setText(json); setOriginal(json); setRevision(store.revision); setErrors([]); setPreview(null); setMessage('');setMode('basic'); }
    function parse() { try {
        const data: unknown = JSON.parse(text);
        const e = validateSolution(data,categories);
        if (e.length) {
            setErrors(e);
            return null;
        }
        setErrors([]);
        return data as Solution;
    }
    catch (e) {
        setErrors([String(e)]);
        return null;
    } }
    function save() { const s = parse(); if (!s)
        return; if (store.revision !== revision) {
        setErrors(['其他标签页已更新，请重新选择方案载入后再编辑。']);
        return;
    } const prev = store.solutions.find(x => x.id === selected); if (prev && (s.id !== prev.id || s.slug !== prev.slug)) {
        setErrors(['保存后的 id 和 slug 不可修改']);
        return;
    } if (store.solutions.some(x => x.id !== selected && (x.id === s.id || x.slug === s.slug))) {
        setErrors(['id 或 slug 已存在']);
        return;
    } if (prev && criticalChanged(prev, s)) {
        s.qualityStatus = 'draft';
        s.testedAt = null;
        s.validationRecords = [];
        s.testNotes = [...s.testNotes, '关键内容修改，需重新测试。'];
    }
    else if (prev && !transitionAllowed(prev.qualityStatus, s.qualityStatus)) {
        setErrors(['不允许此状态流转，请按数据规则逐步操作']);
        return;
    } if (!prev && s.qualityStatus !== 'draft') {
        setErrors(['新增方案必须为 draft']);
        return;
    } const ok = store.save([...store.overrides.filter(x => x.id !== s.id), s]); const json = JSON.stringify(s, null, 2); setText(json); setOriginal(json); setSelected(s.id); if(ok){setSelected(null);setText('');setOriginal('');}setMessage(ok ? '提示词已保存' : '已保存在当前会话；持久化失败，刷新会丢失'); }
    const filtered=store.solutions.filter(s=>[s.title,s.category,s.domain].join(' ').toLowerCase().includes(query.toLowerCase()));
    const pages=Math.max(1,Math.ceil(filtered.length/9)),current=Math.min(page,pages);
    let draft:Solution|null=null;try{draft=JSON.parse(text);}catch{}
    function change(key:string,value:string){if(!draft)return;setText(JSON.stringify({...draft,[key]:value},null,2));setPreview(null);setMessage('');}
    return <><FeedbackToast message={message} onDismiss={()=>setMessage('')}/><section className="page-heading workspace-heading"><h1>提示词管理</h1><p>新增和维护提示词，管理场景分类与归属。</p></section>{<div className="workspace-toolbar"><div className="workspace-tabs"><button aria-pressed={area==='prompts'} onClick={()=>setArea('prompts')}>提示词列表</button><button aria-pressed={area==='scenes'} onClick={()=>setArea('scenes')}>场景管理</button></div>{area==='scenes'&&<div className="scene-toolbar-slot" ref={setSceneToolbar}/>} {area==='prompts'&&<button className="primary" onClick={()=>{setCreating(true);setNewTitle('');setNewBody('');setNewScene(categories.flatMap(c=>c.scenes)[0]??'');setMessage('');}}>＋ 新增提示词</button>}</div>}<div hidden={area!=='scenes'}><SceneManager toolbarTarget={sceneToolbar}/></div><div hidden={area!=='prompts'}>{creating&&<WorkspaceDialog title="新增提示词" message={message} onClose={()=>{if((newTitle.trim()||newBody.trim())&&!confirm('放弃本次新增内容？'))return;setCreating(false);}}><section className="panel workspace-editor"><label htmlFor="new-prompt-title">名称 *</label><input id="new-prompt-title" value={newTitle} onChange={e=>setNewTitle(e.target.value)} autoFocus/><label htmlFor="new-prompt-scene">所属类别 *</label><UISelect id="new-prompt-scene" ariaLabel="新增提示词所属类别" value={newScene} onChange={setNewScene} options={categories.flatMap(c=>c.scenes.map(scene=>({value:scene,label:scene,group:c.name})))}/><label htmlFor="new-prompt-body">完整提示词 *</label><textarea id="new-prompt-body" className="personal-prompt-body" value={newBody} onChange={e=>setNewBody(e.target.value)} placeholder="直接填写完整提示词，无需编写 JSON"/><div className="actions"><button onClick={()=>setCreating(false)}>取消</button><button className="primary" onClick={()=>{const category=categories.find(c=>c.scenes.includes(newScene));if(!newTitle.trim()||!newBody.trim()||!category){setMessage('请填写名称、类别和提示词正文');return;}const value=newPrompt({title:newTitle,body:newBody,domain:category.name,category:newScene,id:crypto.randomUUID()});const errors=validateSolution(value,categories);if(errors.length){setMessage(errors.join('；'));return;}if(store.save([...store.overrides,value])){setCreating(false);setMessage('提示词已新增');}else setMessage('保存失败，请导出备份');}}>保存提示词</button></div></section></WorkspaceDialog>}<div className="admin-layout admin-workspace"><aside className="panel admin-library"><h2>提示词列表</h2><input aria-label="搜索提示词" placeholder="搜索名称或类别" value={query} onChange={e=>{setQuery(e.target.value);setPage(1);}}/><div className="admin-template-list">{filtered.slice((current-1)*9,current*9).map(s=><article className="admin-item" key={s.id}><div><strong>{s.title}</strong><small>{s.category} · {store.overrides.some(o=>o.id===s.id)?'本地编辑':'内置'}</small></div><button type="button" onClick={()=>choose(s)} aria-label={'编辑'+s.title}>编辑</button></article>)}{!filtered.length&&<p className="muted">没有匹配的模板</p>}</div><Pagination page={current} pages={pages} total={filtered.length} onChange={setPage} label="提示词列表分页"/></aside>{text&&<WorkspaceDialog title="编辑提示词" wide message={message} onClose={closeEditor}><section className="panel admin-editor-panel" data-has-selection={!!draft}><header className="workspace-toolbar">{draft&&text!==original&&<span className="muted">有未保存修改</span>}{text&&<div className="workspace-tabs compact-tabs"><button aria-pressed={mode==='basic'} onClick={()=>setMode('basic')}>基础编辑</button><button aria-pressed={mode==='json'} onClick={()=>setMode('json')}>高级 JSON</button><button aria-pressed={mode==='preview'} onClick={()=>{const value=parse();if(value){setPreview(value);setMode('preview');}}}>预览</button></div>}</header>{text?<><div className={'admin-editor-scroll mode-'+mode}>{mode==='preview'&&preview?<SolutionDetail key={JSON.stringify(preview)} solution={preview} preview/>:mode==='basic'&&draft?<div className="admin-basic-form"><label htmlFor="template-title">名称</label><input id="template-title" value={draft.title} onChange={e=>change('title',e.target.value)}/><label htmlFor="template-scene">所属类别</label><UISelect id="template-scene" ariaLabel="所属类别" value={draft.category} onChange={value=>{const category=categories.find(c=>(c.scenes as readonly string[]).includes(value));setText(JSON.stringify({...draft,domain:category?.name??draft.domain,category:value},null,2));setPreview(null);setMessage('');}} options={categories.flatMap(c=>c.scenes.map(scene=>({value:scene,label:scene,group:c.name})))}/><label htmlFor="template-problem">问题描述</label><textarea id="template-problem" rows={3} value={draft.problem} onChange={e=>change('problem',e.target.value)}/><label htmlFor="template-body">提示词模板</label><textarea id="template-body" className="template-body" ref={node=>{if(node){node.style.height='auto';node.style.height=node.scrollHeight+'px';}}} value={draft.solutionContent} onChange={e=>change('solutionContent',e.target.value)}/><p className="muted">保留模板中的变量占位符。字段、案例和分支可在高级 JSON 中维护。</p></div>:<><label htmlFor="editor">完整方案 JSON</label><textarea id="editor" className="editor" spellCheck={false} value={text} onChange={e=>{setText(e.target.value);setPreview(null);setMessage('');}}/></>}{errors.length>0&&<div role="alert" className="error-text">{errors.slice(0,8).map((error,i)=><p key={i}>{error}</p>)}{errors.length>8&&<p>另有 {errors.length-8} 项需要修正。</p>}</div>}</div><footer className="admin-editor-footer"><div className="actions">{selected&&!builtin.some(s=>s.id===selected)&&<button onClick={()=>setDeleteOpen(true)}>删除提示词</button>}<button onClick={()=>{const value=parse();if(value)download(value.slug+'.json',JSON.stringify(value,null,2));}}>导出</button>{selected&&builtin.some(s=>s.id===selected)&&<button onClick={()=>{if(confirm('恢复内置版本并丢弃该方案本地编辑？')){const ok=store.save(store.overrides.filter(s=>s.id!==selected));const value=builtin.find(s=>s.id===selected)!;const json=JSON.stringify(value,null,2);setText(json);setOriginal(json);setPreview(null);setMode('basic');setMessage(ok?'已恢复内置版本':'当前会话已恢复，持久化失败');}}}>恢复内置</button>}</div><button className="primary" onClick={save}>保存提示词</button></footer></>:<div className="workspace-empty"><h3>从列表选择提示词</h3><p>个人创建的提示词统一保存在“我的提示词”。</p></div>}</section></WorkspaceDialog>}</div></div>{deleteOpen&&<ConfirmDialog title="删除提示词？" onCancel={()=>setDeleteOpen(false)} onConfirm={()=>{if(store.save(store.overrides.filter(s=>s.id!==selected))){setSelected(null);setText('');setOriginal('');setPreview(null);setMessage('提示词已删除');setDeleteOpen(false);}else setMessage('删除失败，请重试');}}><p>删除当前自建提示词，已保存的个人副本不受影响。</p></ConfirmDialog>}</>;
}

