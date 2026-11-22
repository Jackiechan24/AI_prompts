'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {QiPrompt,QiMenu10} from 'qingicon-react';
import { useRef, useState } from 'react';
export function Header() { const pathname=usePathname(); const [open, setOpen] = useState(false); const ref = useRef<HTMLButtonElement>(null); return <header><div className="nav-wrap"><Link className="brand" href="/" aria-label="即用 AI 提示词首页"><span className="brand-icon"><QiPrompt size={25} aria-hidden="true"/></span><b>即用</b><span className="brand-description">AI 提示词</span></Link><button type="button" className="menu" aria-label={open?'关闭菜单':'打开菜单'} title={open?'关闭菜单':'打开菜单'} ref={ref} aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}><QiMenu10 size={24} variant="line" aria-hidden="true"/></button><nav id="navigation" className={open ? 'open' : ''} onKeyDown={e => { if (e.key === 'Escape') {
    setOpen(false);
    ref.current?.focus();
} }}>{[['/', '提示词'], ['/categories', '场景分类'], ['/my-solutions', '我的提示词'], ['/admin', '提示词管理']].map(([href, label]) => <Link key={href} href={href} aria-current={(pathname===href || (href!=='/' && pathname.startsWith(href+'/')) || (href==='/' && pathname.startsWith('/solutions/'))) ? 'page' : undefined} onClick={() => { setOpen(false); ref.current?.focus(); }}>{label}</Link>)}</nav></div></header>; }


