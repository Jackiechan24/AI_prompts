'use client';
import {useState} from 'react';
import {UISelect} from './ui-select';
import {fieldError} from '@/lib/template';
import type {Values,Variable} from '@/types/solution';
export function Field({ variable: v, value, onChange, externalError }: {
    externalError?: string;
    variable: Variable;
    value: Values[string];
    onChange: (value: Values[string]) => void;
}) { const [touched, setTouched] = useState(false); const error = externalError || fieldError(v, value); const id = 'field-' + v.key; const hint = v.help ?? '请根据实际任务填写；未知信息请注明待补充。'; const common = { id, 'aria-describedby': id + '-help ' + id + '-error', 'aria-invalid': (touched || !!externalError) && !!error, onBlur: () => setTouched(true) }; return <div className="field" data-field={v.key}><label htmlFor={id}>{v.label} {v.required && <span className="required">*</span>}</label>{v.type === 'textarea' ? <textarea {...common} rows={3} placeholder={hint} value={String(value ?? '')} onChange={e => onChange(e.target.value)}/> : v.type === 'select' ? <UISelect id={id} ariaLabel={v.label} describedBy={common['aria-describedby']} invalid={common['aria-invalid']} onBlur={common.onBlur} value={String(value??'')} onChange={onChange} options={[{value:'',label:'请选择'},...(v.options??[]).map(o=>({value:o,label:o}))]}/> : v.type === 'multiselect' ? <fieldset id={id} aria-describedby={id + '-help'}><legend className="sr-only">{v.label}</legend>{v.options?.map(o => <label key={o}><input type="checkbox" checked={Array.isArray(value) && value.includes(o)} onChange={e => onChange(e.target.checked ? [...(Array.isArray(value) ? value : []), o] : (Array.isArray(value) ? value : []).filter(x => x !== o))}/>{o}</label>)}</fieldset> : <input {...common} type={v.type} min={v.min} max={v.max} step={v.step} placeholder={v.placeholder} value={String(value ?? '')} onChange={e => onChange(e.target.value)}/>}<span className="sr-only" id={id + '-help'}>{hint}</span><span className="error-text" id={id + '-error'}>{(touched || externalError) && error}</span></div>; }
