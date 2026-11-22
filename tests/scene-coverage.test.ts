import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {TaskResult} from '@/components/task-result';
import {OutcomePreview} from '@/components/result-artwork';
import {search} from '@/lib/search';
import {it,expect} from 'vitest';
import {builtin} from '@/lib/solutions';
import {categories} from '@/data/categories';
import {promptFrameworks} from '@/data/prompt-frameworks';
import {formGuidance} from '@/data/form-guidance';
import {render} from '@/lib/template';
import {selectPrompt} from '@/lib/prompt';
import presentations from '@/data/scenario-presentations.json';
import {pptCaseValues} from '@/lib/case-values';
it('全部31场景有独立方案及框架、表单、可复制案例',()=>{expect(builtin).toHaveLength(31);for(const category of categories)for(const scene of category.scenes){const list=builtin.filter(s=>s.domain===category.name&&s.category===scene);expect(list,scene).toHaveLength(1);const s=list[0],f=promptFrameworks[s.slug];expect(f).toBeTruthy();expect(formGuidance[s.slug].order.slice().sort()).toEqual(s.variables.map(v=>v.key).sort());const values=s.resultExample.workedExample?.values??pptCaseValues(s.resultExample.caseStudy!);const p=selectPrompt(s,values);const r=render(p.content,s.variables,values);expect(r.valid,s.slug).toBe(true);expect(r.text).not.toMatch(/{{|预设规则/);}});
it('新增23场景有专属可用展示数据且材料与结果有依据',()=>{expect(Object.keys(presentations)).toHaveLength(23);for(const [slug,p] of Object.entries(presentations)){const s=builtin.find(s=>s.slug===slug)!;const c=s.resultExample.workedExample!;expect(c.rows).toEqual(p.rows);expect(c.headers).toEqual(p.headers);expect(c.checks.length).toBeGreaterThan(1);expect(c.inputs.every(r=>r[0].startsWith('S'))).toBe(true);expect(s.qualityStatus).toBe('draft');expect(s.testedAt).toBeNull();expect(s.validationRecords).toEqual([]);}});
it('新场景表单不把某个案例的具体主题当作用户问题',()=>{for(const slug of Object.keys(presentations)){const s=builtin.find(s=>s.slug===slug)!;const task=s.variables.find(v=>v.key==='task')!;expect(task.label).not.toContain('20人');expect(task.label).not.toContain('三份');expect(s.variables.find(v=>v.key==='output')?.outputDefault).not.toContain('6000');}});

it('新增场景成果和缩略图实际渲染，不落入选题兜底且筛选均可达',()=>{for(const slug of Object.keys(presentations)){const s=builtin.find(s=>s.slug===slug)!;const c=s.resultExample.workedExample!;const html=renderToStaticMarkup(createElement(TaskResult,{slug,data:c}));expect(html).toContain('scenario-result');expect(html).not.toContain('AI 办公账号 / 选题规划');expect(html).toContain(c.rows[0][0].replace(/&/g,'&amp;'));const preview=renderToStaticMarkup(createElement(OutcomePreview,{solution:s}));expect(preview).toContain(s.category);expect(preview).not.toContain('账号选题 / 内容规划');expect(search(builtin,new URLSearchParams({domain:s.domain,category:s.category})).map(s=>s.slug)).toEqual([slug]);}});
