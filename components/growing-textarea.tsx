 'use client';
import {useLayoutEffect,useRef,type TextareaHTMLAttributes} from 'react';
/** The enclosing editor owns scrolling; the field grows to its actual content. */
export function GrowingTextarea(props:TextareaHTMLAttributes<HTMLTextAreaElement>){const ref=useRef<HTMLTextAreaElement>(null);useLayoutEffect(()=>{const node=ref.current;if(node){node.style.height='auto';node.style.height=node.scrollHeight+'px';}},[props.value]);return <textarea {...props} ref={ref} className={(props.className??'')+' growing-textarea'}/>;}
