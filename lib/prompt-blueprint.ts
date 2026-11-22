import blueprints from '@/data/prompt-blueprints.json';
import type {Solution} from '@/types/solution';
export type PromptBlueprint={framework:string;opening:string;modules:{code:string;keys:string[]}[];sections:{title:string;lines:string[]}[];variants:NonNullable<Solution['promptVariants']>};
/** Compile authored sections only. User values are substituted separately, in one pass. */
export function compileBlueprint(blueprint:PromptBlueprint):string{
 if(!blueprint.opening.trim()||!blueprint.sections.length)throw new Error('提示词缺少任务或模块');
 const titles=new Set<string>();
 for(const section of blueprint.sections){
  if(!section.title.trim()||titles.has(section.title)||!section.lines.some(line=>line.trim()))throw new Error('提示词模块为空或重复');
  titles.add(section.title);
 }
 return blueprint.opening+'\n\n'+blueprint.sections.map(section=>'【'+section.title+'】\n'+section.lines.join('\n')).join('\n\n');
}
export function getBlueprint(slug:string):PromptBlueprint|undefined{return (blueprints as Record<string,PromptBlueprint>)[slug];}
export function promptWritingErrors(text:string):string[]{
 const errors:string[]=[];
 if(/[。；;][；;]/u.test(text))errors.push('句末标点重复');
 if(/^[^\n]*[？?]：/mu.test(text))errors.push('表单问句混入正式提示词');
 if(/依次执行：[^\n]*。；/u.test(text))errors.push('执行步骤未分项');
 if(/按上述交付结构提供具体可用内容，/u.test(text))errors.push('案例检查串入通用交付规则');
 return errors;
}
