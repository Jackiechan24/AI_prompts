import {frameworkLibrary,type FrameworkName} from '@/data/framework-library';
import type {TaskFramework} from '@/data/prompt-frameworks';
export type ModuleBinding={keys:string[];preset?:string};
export type FrameworkPromptSpec={name:FrameworkName;reason:string;bindings:Record<string,ModuleBinding>;fields:{key:string;label:string;promptLabel?:string}[];opening:string;output:string;rules:string[];acceptance:string[]};
/** Authoring helper. Runtime uses approved scenario templates, never guesses business rules. */
export function createFrameworkPrompt(spec:FrameworkPromptSpec):{framework:TaskFramework;template:string}{
 const definition=frameworkLibrary[spec.name];
 if(!definition)throw new Error('未知提示词框架');
 const codes=new Set(definition.modules.map(m=>m.code));
 for(const code of Object.keys(spec.bindings))if(!codes.has(code))throw new Error('未知框架模块：'+code);
 const seen=new Set<string>();
 const groups=definition.modules.map(m=>{
  const binding=spec.bindings[m.code];
  if(!binding||(!binding.keys.length&&!binding.preset?.trim()))throw new Error('模块缺少字段或预置规则：'+m.code);
  for(const key of binding.keys){if(seen.has(key)||!spec.fields.some(f=>f.key===key))throw new Error('字段重复或未知：'+key);seen.add(key);}
  return {code:m.code,english:m.english,title:m.term,keys:binding.keys,preset:binding.preset??''};
 });
 if(spec.fields.some(f=>!seen.has(f.key)))throw new Error('存在未映射字段');
 if(!spec.opening.trim()||!spec.output.trim()||!spec.rules.length||!spec.acceptance.length||[...spec.rules,...spec.acceptance].some(s=>!s.trim()))throw new Error('任务、输出、处理规则和验收要求必须完整');
 const blocks=groups.map(g=>{
  const lines=g.keys.map(key=>{const field=spec.fields.find(f=>f.key===key)!;const label=field.promptLabel??field.label;if(/[？?]/.test(label))throw new Error('正式提示词标签不能使用表单问题：'+key);return `${label}：{{${key}}}`;});
  if(g.preset)lines.unshift(g.preset);
  return `【${g.title}】\n${lines.join('\n')}`;
 });
 const sentence=(text:string)=>text.trim().replace(/[。；;]+$/u,'')+'。';
 return {framework:{name:spec.name,reason:spec.reason,groups},template:`${spec.opening}\n\n${blocks.join('\n\n')}\n\n【交付规格】\n${spec.output}\n完成检查：${spec.acceptance.map(s=>s.replace(/[。；;]+$/u,'')).join('；')}。\n\n【执行步骤】\n${spec.rules.map((r,i)=>`${i+1}. ${sentence(r)}`).join('\n')}`};
}
