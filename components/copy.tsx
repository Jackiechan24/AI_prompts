'use client';
import {useEffect,useRef,useState} from 'react';
import {FeedbackToast} from './feedback-toast';
export function Copy({ text, disabled = false, onCopied, label = '复制完整提示词', beforeCopy, variant = 'primary' }: {
    variant?: 'primary'|'secondary';
    beforeCopy?: () => boolean;
    text: string;
    disabled?: boolean;
    onCopied?: () => void;
    label?: string;
}) { const [message, setMessage] = useState(''), [manual, setManual] = useState(false); const ref = useRef<HTMLTextAreaElement>(null); useEffect(()=>{if(message!=='复制成功')return;const timer=setTimeout(()=>setMessage(''),2000);return()=>clearTimeout(timer);},[message]); return <div className="copy"><button className={variant==='primary'?'primary':'secondary'} disabled={disabled} onClick={async () => { setMessage(''); setManual(false); if(beforeCopy && !beforeCopy()) return; try {
    await navigator.clipboard.writeText(text);
    setMessage('复制成功');
    setManual(false);
    onCopied?.();
}
catch {
    setMessage('自动复制失败，请选择文本后手动复制');
    setManual(true);
} }}>{label}</button><FeedbackToast message={message} onDismiss={()=>setMessage('')}/>{manual && <div><textarea aria-label="手动复制完整文本" ref={ref} value={text} readOnly rows={8}/><button onClick={() => { ref.current?.focus(); ref.current?.select(); }}>选择全部文本</button><button onClick={() => { setMessage('复制成功'); setManual(false); onCopied?.(); }}>已完成复制</button></div>}</div>; }
