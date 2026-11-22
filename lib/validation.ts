import Ajv from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import schema from '@/schemas/solution.schema.json';
import { categories } from '@/data/categories';
import type { Solution, Status } from '@/types/solution';
import { fieldError } from './template';
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
export function validateSolution(data: unknown, catalog:readonly {name:string;scenes:readonly string[]}[]=categories): string[] {
    if (!validate(data))
        return (validate.errors ?? []).map(e => (e.instancePath || '/') + ' ' + e.message);
    const s = data as Solution;
    const errors: string[] = [];
    const walk = (x: unknown, path: string) => { if (typeof x === 'string' && !x.trim())
        errors.push(path + ' 不能为空白'); if (Array.isArray(x))
        x.forEach((v, i) => walk(v, path + '/' + i));
    else if (x && typeof x === 'object')
        Object.entries(x).forEach(([k, v]) => walk(v, path + '/' + k)); };
    walk(s, '');
    if (!catalog.some(c => c.name === s.domain && c.scenes.includes(s.category)))
        errors.push('/category 未知领域或场景');
    const example=s.resultExample.workedExample;
    if(example){
        for(const row of example.rows)if(row.length!==example.headers.length)errors.push('/resultExample/rows 列数不匹配');
        for(const row of example.inputs)if(row.length!==example.inputHeaders.length)errors.push('/resultExample/inputs 列数不匹配');
        for(const section of example.sections??[])for(const row of section.rows)if(row.length!==section.headers.length)errors.push('/resultExample/sections/'+section.title+' 列数不匹配');
        if(new Set((example.sections??[]).map(section=>section.title)).size!==(example.sections??[]).length)errors.push('/resultExample/sections 重复标题');
    }
    if (new Set(s.variables.map(v => v.key)).size !== s.variables.length)
        errors.push('/variables key 重复');
    if (s.stages && new Set(s.stages.map(v => v.id)).size !== s.stages.length)
        errors.push('/stages id 重复');
    const variantIds=new Set<string>();
    for(const variant of s.promptVariants??[]){
        const variable=s.variables.find(v=>v.key===variant.key);
        if(!variable || (variable.options&&!variable.options.includes(variant.equals)))errors.push('/promptVariants 无效选择条件');
        const id=variant.key+'='+variant.equals;if(variantIds.has(id))errors.push('/promptVariants 重复条件');variantIds.add(id);
        for(const key of variant.omitKeys??[]){const v=s.variables.find(v=>v.key===key);if(!v||v.required||(v.requiredWhen?.key===variant.key&&v.requiredWhen.equals===variant.equals)||variant.content.includes('{{'+key+'}}'))errors.push('/promptVariants 无效省略字段 '+key);}
    }
    const texts = [s.solutionContent, ...(s.promptVariants??[]).map(v=>v.content), ...(s.stages ?? []).map(v => v.content)];
    for (const text of texts) {
        if (text.includes('\\n'))
            errors.push('/content 使用真实换行');
        const keys = [...text.matchAll(/{{(.*?)}}/g)].map(m => m[1]);
        for (const k of keys)
            if (!s.variables.some(v => v.key === k))
                errors.push('/content 未知占位符 ' + k);
        if (/{{|}}/.test(text.replace(/{{[a-z][a-z0-9_]*}}/g, '')))
            errors.push('/content 非法占位符');
        for (const v of s.variables.filter(v => !v.required)) {
            for (const block of (v.emptyBehavior === 'omitParagraph' ? text.split(/\n\s*\n/) : text.split('\n')).filter(b => b.includes('{{' + v.key + '}}')))
                if ([...block.matchAll(/{{(.*?)}}/g)].some(m => m[1] !== v.key))
                    errors.push('/variables/' + v.key + ' 可选块含其他变量');
        }
    }
    for (const v of s.variables) {
        if (!texts.some(t => t.includes('{{' + v.key + '}}')))
            errors.push('/variables/' + v.key + ' 未使用');
        if (v.defaultValue !== undefined) {
            const e = fieldError(v, v.defaultValue);
            if (e)
                errors.push('/variables/' + v.key + ' 默认值：' + e);
        }
    }
    if (['verified', 'published'].includes(s.qualityStatus)) {
        for (const type of ['normal', 'incomplete', 'abnormal', 'boundary']) {
            const records = s.validationRecords.filter(r => r.caseType === type).sort((a, b) => b.date.localeCompare(a.date));
            if (!records.length || records[0].result !== 'pass' || Object.values(records[0].scores).some(n => n < 4))
                errors.push('/validationRecords 缺少有效通过记录 ' + type);
        }
        if (s.testedAt !== s.validationRecords.map(r => r.date).sort().at(-1))
            errors.push('/testedAt 必须为最近测试日期');
    }
    return errors;
}
export function transitionAllowed(from: Status, to: Status) { return from === to || to === 'deprecated' || ({ draft: ['testing'], testing: ['draft', 'verified'], verified: ['testing', 'published'], published: ['testing'], deprecated: ['draft'] } as Record<Status, string[]>)[from].includes(to); }
export function criticalChanged(a: Solution, b: Solution) { return ['solutionContent', 'promptVariants', 'variables', 'stages', 'acceptanceCriteria'].some(k => JSON.stringify(a[k as keyof Solution]) !== JSON.stringify(b[k as keyof Solution])); }
