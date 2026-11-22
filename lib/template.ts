import type { Variable, Values } from '@/types/solution';
export const empty = (v: unknown) => v == null || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && !v.length);
export function fieldError(v: Variable, value: unknown): string { if (empty(value))
    return v.required ? '请填写' + v.label : ''; if (v.type === 'number') {
    const n = Number(value);
    if (!Number.isFinite(n) || typeof value === 'object')
        return '请输入有效数字';
    if (v.min !== undefined && n < v.min || v.max !== undefined && n > v.max)
        return '数字超出范围';
    if (v.step && Math.abs((n - (v.min ?? 0)) / v.step - Math.round((n - (v.min ?? 0)) / v.step)) > 1e-8)
        return '数字不符合步长';
}
else if (v.type === 'multiselect') {
    if (!Array.isArray(value) || new Set(value).size !== value.length || value.some(x => !v.options?.includes(x)))
        return '请选择合法选项';
}
else {
    if (typeof value !== 'string')
        return '请输入文本';
    if (v.type === 'select' && !v.options?.includes(value))
        return '请选择合法选项';
    if (v.type === 'date' && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value))
        return '请输入有效日期';
} if (String(value).includes('{{') || String(value).includes('}}'))
    return '输入不能包含模板占位符'; return ''; }
export const effectiveVariable=(v:Variable,values:Values):Variable=>({...v,required:v.required || !!(v.requiredWhen && values[v.requiredWhen.key]===v.requiredWhen.equals)});
export function render(template: string, variables: Variable[], values: Values) { const errors: Record<string, string> = {}; let text = template; const used = [...template.matchAll(/{{(.*?)}}/g)].map(m => m[1]); for (const key of used)
    if (!variables.some(v => v.key === key))
        errors[key] = '未知占位符：' + key; for (const v of variables.filter(v => used.includes(v.key))) {
    const effective=effectiveVariable(v,values); const error = fieldError(effective, values[v.key]);
    if (error)
        errors[v.key] = error;
    if (!effective.required && empty(values[v.key]) && !v.outputDefault) {
        const blocks = v.emptyBehavior === 'omitParagraph' ? text.split(/\n\s*\n/) : text.split('\n');
        text = blocks.filter(b => !b.includes('{{' + v.key + '}}')).join(v.emptyBehavior === 'omitParagraph' ? '\n\n' : '\n');
    }
} text = text.replace(/\n[ \t]*\n(?:[ \t]*\n)+/g, "\n\n").trim(); text = text.replace(/{{(.*?)}}/g, (_, k: string) => { const v=variables.find(v=>v.key===k); const value = empty(values[k]) && v && !effectiveVariable(v,values).required ? (v.outputDefault??values[k]) : values[k]; return empty(value) ? '' : Array.isArray(value) ? value.join('、') : String(value); }); if (/{{|}}/.test(text))
    errors.template = '存在残留占位符'; return { text, errors, valid: Object.keys(errors).length === 0 }; }
