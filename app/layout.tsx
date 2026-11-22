import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Provider } from '@/components/provider';
import { Header } from '@/components/shell';
import './globals.css';
export const metadata: Metadata = { title: '即用 · AI 提示词', description: '按场景填写需求，创建完整提示词，复制到 AI 完成具体任务。' };
export default function RootLayout({ children }: {
    children: React.ReactNode;
}) { return <html lang="zh-CN"><body className="vitrine-site"><a className="skip" href="#main">跳至主要内容</a><Provider><Header /><main id="main"><Suspense fallback={<p role="status">正在载入…</p>}>{children}</Suspense></main><footer className="site-footer"><span className="footer-wordmark">Prompt</span></footer></Provider></body></html>; }
