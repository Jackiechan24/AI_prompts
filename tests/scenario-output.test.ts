import {it,expect} from 'vitest';
import {builtin} from '@/lib/solutions';
import {render} from '@/lib/template';
import {selectPrompt} from '@/lib/prompt';
const sections:Record<string,string[]>= {'customer-review-analysis':['分析任务','分类与处理要求','处理动作','背景材料与边界','标注参考'],'excel-sales-analysis':['分析职责','任务与输入','执行步骤','分析边界'],'meeting-notes-action-items':['整理职责','任务与材料'],'report-content-organization':['整理职责','整理任务','汇报背景与材料'],'speech-writing':['背景与材料','发言目标','讲述风格','表达语气','目标听众'],'xiaohongshu-topic-planning':['能力与策划职责','用户洞察与材料','本轮任务','表达特点','探索与筛选']};
it('其他场景按框架组织实际指令且案例可直接填充',()=>{for(const [slug,headings] of Object.entries(sections)){const s=builtin.find(s=>s.slug===slug)!;const values=s.resultExample.workedExample!.values;const text=render(selectPrompt(s,values).content,s.variables,values);expect(text.valid,slug).toBe(true);for(const heading of headings)expect(text.text).toContain('【'+heading+'】');expect(text.text).not.toMatch(/{{|预设规则|【默认配置】/);}});
it('演讲提纲和全文复制规则分离',()=>{const s=builtin.find(s=>s.slug==='speech-writing')!;for(const mode of ['完整演讲稿','演讲提纲']){const r=render(selectPrompt(s,{mode}).content,s.variables,{...s.resultExample.workedExample!.values,mode});expect(r.valid).toBe(true);if(mode==='演讲提纲'){expect(r.text).toContain('不展开完整逐字稿');expect(r.text).not.toContain('交付可直接讲述的完整稿');}else expect(r.text).toContain('交付可直接讲述的完整稿');}});
it('合并检查分支不附带执行文件的替代交付',()=>{const s=builtin.find(s=>s.slug==='excel-multi-sheet-merge')!;const p=selectPrompt(s,{mode:'请先检查并建议'});expect(p.content).toContain('本轮仅提交建议和关键待确认项');expect(p.content).not.toContain('工具不能生成文件时提供CSV');});
