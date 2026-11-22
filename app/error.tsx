'use client';
import Link from 'next/link';
export default function Error({ reset }: {
    reset: () => void;
}) { return <section className="empty"><h1>页面暂时无法加载</h1><p>请重试，或返回首页继续浏览。</p><button onClick={reset}>重试</button><Link href="/">返回首页</Link></section>; }
