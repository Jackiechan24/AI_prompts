'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {initialCatalog,validCatalog,type SceneCatalog,type SceneCategory} from '@/lib/scene-catalog';
import {categories as originalCategories} from '@/data/categories';
import { builtin } from '@/lib/solutions';
import { validateSolution } from '@/lib/validation';
import { readStored, storageKey, download } from '@/lib/storage';
import {validPersonalPrompts,type PersonalPrompt} from '@/lib/personal-prompts';
import type { Solution } from '@/types/solution';
type Recent = {
    id: string;
    usedAt: string;
};
type Store = {
    catalog:SceneCatalog;
    categories:SceneCategory[];
    saveCatalog:(catalog:SceneCatalog)=>boolean;
    prompts: PersonalPrompt[];
    savePrompts: (items:PersonalPrompt[])=>boolean;
    ready: boolean;
    solutions: Solution[];
    overrides: Solution[];
    favorites: string[];
    recent: Recent[];
    toggle: (id: string) => void;
    used: (id: string) => void;
    save: (items: Solution[]) => boolean;
    revision: number;
};
const Context = createContext<Store | null>(null);
export const useStore = () => useContext(Context)!;
export function Provider({ children }: {
    children: ReactNode;
}) {
    const [catalog,setCatalog]=useState<SceneCatalog>(initialCatalog);
    const [prompts,setPrompts]=useState<PersonalPrompt[]>([]);
    const [ready, setReady] = useState(false), [overrides, setOverrides] = useState<Solution[]>([]), [favorites, setFavorites] = useState<string[]>([]), [recent, setRecent] = useState<Recent[]>([]), [messages, setMessages] = useState<string[]>([]), [blocked, setBlocked] = useState<string[]>([]), [revision, setRevision] = useState(0);
    useEffect(() => { function load() { const taxonomy=readStored<SceneCatalog>('scene-catalog',initialCatalog,validCatalog);setCatalog(taxonomy.data); const personal=readStored<PersonalPrompt[]>('personal-prompts',[],validPersonalPrompts);setPrompts(personal.data); const f = readStored('favorites', [], x => Array.isArray(x) && x.every(v => typeof v === 'string')); const r = readStored('recent', [], x => Array.isArray(x) && x.every(v => v && typeof v.id === 'string' && typeof v.usedAt === 'string' && !Number.isNaN(Date.parse(v.usedAt)))); const o = readStored('overrides', [], x => { if (!Array.isArray(x) || !x.every(v => v && typeof v==='object' && validateSolution({...v,...taxonomy.data.placements[v.id]},[...originalCategories,...taxonomy.data.categories]).length === 0))
        return false; const merged = [...builtin.filter(b => !x.some(v => v.id === b.id)), ...x]; return new Set(merged.map(v => v.id)).size === merged.length && new Set(merged.map(v => v.slug)).size === merged.length && x.every(v => !builtin.some(b => b.id === v.id && b.slug !== v.slug)); }); setFavorites(f.data); setRecent(r.data); setOverrides(o.data); setMessages([taxonomy.message,personal.message,f.message, r.message, o.message].filter(Boolean)); setBlocked([['scene-catalog',taxonomy],['personal-prompts',personal],['favorites', f], ['recent', r], ['overrides', o]].filter(([, v]) => (v as {
        blocked: boolean;
    }).blocked).map(([k]) => k as string)); setReady(true); setRevision(v => v + 1); } load(); window.addEventListener('storage', load); return () => window.removeEventListener('storage', load); }, []);
    function persist(name: string, data: unknown) { if (blocked.includes(name)) {
        setMessages(m => [...new Set([...m, '当前仅临时保存，刷新会丢失；请先导出并重置异常存储'])]);
        return false;
    } try {
        localStorage.setItem(storageKey(name), JSON.stringify({ version: 1, data }));
        return true;
    }
    catch {
        setMessages(m => [...new Set([...m, '存储失败：当前仅临时保存，刷新会丢失'])]);
        return false;
    } }
    const solutions = [...builtin.filter(b => !overrides.some(o => o.id === b.id)), ...overrides].map(s=>catalog.placements[s.id]?{...s,...catalog.placements[s.id]}:s);
    const value: Store = {catalog,categories:catalog.categories,saveCatalog(next){if(!validCatalog(next))return false;if(!persist('scene-catalog',next))return false;setCatalog(next);setRevision(v=>v+1);return true;},prompts,savePrompts(items){if(!validPersonalPrompts(items))return false;const ok=persist('personal-prompts',items);if(ok)setPrompts(items);return ok;},ready,solutions,overrides,favorites,recent,revision,toggle(id){const next=favorites.includes(id)?favorites.filter(v=>v!==id):[...favorites,id];setFavorites(next);persist('favorites',next);},used(id){const next=[{id,usedAt:new Date().toISOString()},...recent.filter(v=>v.id!==id)].slice(0,20);setRecent(next);persist('recent',next);},save(items){const nextCatalog=structuredClone(catalog);for(const item of items)if(nextCatalog.placements[item.id])nextCatalog.placements[item.id]={domain:item.domain,category:item.category};if(!persist('overrides',items))return false;if(JSON.stringify(nextCatalog)!==JSON.stringify(catalog)){if(!persist('scene-catalog',nextCatalog))return false;setCatalog(nextCatalog);}setOverrides(items);return true;}};
return <Context.Provider value={value}>{messages.length>0&&<aside className="notice" aria-live="polite">{messages.map(m=><p key={m}>{m}</p>)}{blocked.map(name=><span key={name}><button onClick={()=>{try{download(name+'-backup.json',localStorage.getItem(storageKey(name))??'');}catch{setMessages(['无法读取原始存储']);}}}>导出 {name} 原始内容</button><button onClick={()=>{if(confirm('确认清除 '+name+'？请先导出备份。')){try{localStorage.removeItem(storageKey(name));location.reload();}catch{setMessages(['重置失败']);}}}}>重置 {name}</button></span>)}</aside>}{children}</Context.Provider>;
}
