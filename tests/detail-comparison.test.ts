import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {it,expect} from 'vitest';
import {builtin} from '@/lib/solutions';
import {WorkedCase} from '@/components/worked-case';
import {PptCase} from '@/components/ppt-case';
import {render} from '@/lib/template';
import {selectPrompt} from '@/lib/prompt';
import {pptCaseValues} from '@/lib/case-values';

it('30个案例同时提供同一材料对应的结果与完整已填写提示词',()=>{
 for(const s of builtin.filter(item=>item.resultExample.workedExample)) {
  const c=s.resultExample.workedExample!;
  const prompt=render(selectPrompt(s,c.values).content,s.variables,c.values);
  expect(prompt.valid,s.slug).toBe(true);
  const html=renderToStaticMarkup(createElement(WorkedCase,{data:c,template:s.solutionContent,variables:s.variables,slug:s.slug,variants:s.promptVariants}));
  expect(html,s.slug).toContain('aria-label="结果示例"');expect(html,s.slug).toContain('aria-label="对应框架提示词"');
  expect(html,s.slug).toContain('prompt-reading'); for(const line of prompt.text.split('\n').filter(Boolean)){const content=line.replace(/^【(.+)】$/,'$1').replace(/^\d+[.、]\s*/,'');expect(html,s.slug).toContain(content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;'));}expect(html,s.slug).not.toContain('{{');
  expect(html,s.slug).not.toContain('查看示例材料与要求');expect(html,s.slug).not.toContain('查看方法与核对要点');expect(html,s.slug).not.toMatch(/<button[^>]*>展开全文<\/button>/);
  expect(html,s.slug).not.toMatch(/<details[^>]*open/);
 }
});
it('PPT保留翻页和放大入口，并对照同一案例提示词',()=>{
 const s=builtin.find(item=>item.resultExample.caseStudy)!,c=s.resultExample.caseStudy!;
 const html=renderToStaticMarkup(createElement(PptCase,{data:c,template:s.solutionContent,variables:s.variables,variants:s.promptVariants}));
 const prompt=render(selectPrompt(s,pptCaseValues(c)).content,s.variables,pptCaseValues(c));
 expect(html).toContain('prompt-reading');expect(html).toContain('放大演示');expect(html).toContain('aria-label="下一页"');
 expect(html.match(/aria-label="查看第 /g)).toHaveLength(c.slides.length);
 expect(html).toContain('deck-viewer');expect(html).not.toContain('{{');
});
