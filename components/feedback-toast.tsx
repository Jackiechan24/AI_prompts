 'use client';
import {useEffect} from 'react';
import {createPortal} from 'react-dom';
export function FeedbackToast({message,onDismiss}:{message:string;onDismiss:()=>void}){useEffect(()=>{if(!message)return;const timer=setTimeout(onDismiss, message.includes('失败')?5000:2500);return()=>clearTimeout(timer);},[message,onDismiss]);return message?createPortal(<span className="copy-toast feedback-toast" role="status">{message}</span>,document.body):null;}
