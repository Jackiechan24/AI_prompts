import {it,expect} from 'vitest';
import {builtin} from '../lib/solutions';
import {promptFrameworks} from '../data/prompt-frameworks';
import {pptCaseValues} from '../lib/case-values';
import {render} from '../lib/template';
it('框架、表单与案例提示词共享完整字段映射',()=>{for(const s of builtin){const f=promptFrameworks[s.slug];expect(f).toBeTruthy();const keys=f.groups.flatMap(g=>g.keys);expect(keys).toEqual(s.variables.map(v=>v.key));expect(new Set(keys).size).toBe(keys.length);for(const g of f.groups){expect(g.keys.length>0||!!g.preset).toBe(true);}const values=s.resultExample.workedExample?.values??pptCaseValues(s.resultExample.caseStudy!);const result=render(s.solutionContent,s.variables,values);expect(result.valid,s.slug).toBe(true);expect(result.text.match(/【[^】]+】/g)!.length).toBeGreaterThanOrEqual(f.groups.length);expect(result.text).not.toMatch(/预设规则|请按 .* 框架|[？?]：/);expect(result.text).not.toMatch(/{{|undefined/);}});

it('复制格式清理模板空行但原样保留用户内容',()=>{const s=builtin.find(s=>s.slug==='report-content-organization')!;const raw='随机输入asdf\n\n\n保留换行 $&';const values={action:raw,context:'背景原文',expectation:'输出要求'};const result=render(s.solutionContent,s.variables,values);expect(result.valid).toBe(true);expect(result.text).toContain('整理任务与重点问题：'+raw);expect(result.text).not.toContain('已有观点与保留重点：');expect(result.text).not.toMatch(/[？?]：|预设规则|【[RACE] ·/);});

it('各任务可用最少必填生成明确默认交付，不强制附件',()=>{for(const s of builtin){const values=Object.fromEntries(s.variables.filter(v=>v.required).map(v=>[v.key,v.type==='select'?v.options![0]:'自然填写内容']));const r=render(s.solutionContent,s.variables,values);expect(r.valid,s.slug).toBe(true);expect(r.text).toMatch(/【(?:处理规则|执行边界|处理边界)】/);expect(r.text).not.toContain('附件需在发送本提示词时实际提供');expect(r.text).not.toMatch(/{{|undefined/);}});

it('选填默认值仅在留空时输出，用户内容不与默认内容叠加',()=>{const s=builtin.find(s=>s.slug==='meeting-notes-action-items')!;const base={meeting:'周会',transcript:'主持人确认本周先修复问题。'};const def=render(s.solutionContent,s.variables,base);expect(def.valid).toBe(true);expect(def.text).toContain('输出格式与详略：会议信息、核心摘要');const custom=render(s.solutionContent,s.variables,{...base,format:'仅给三段文字纪要',extract:'只关注发布安排'});expect(custom.text).toContain('输出格式与详略：仅给三段文字纪要');expect(custom.text).not.toContain('输出格式与详略：会议信息');expect(custom.text).not.toContain('提取核心摘要、明确决策');expect(custom.text).not.toMatch(/【验收标准】|【边界与缺口】|【默认配置】/);});
