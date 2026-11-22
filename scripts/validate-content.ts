import {compileBlueprint,getBlueprint,promptWritingErrors} from '../lib/prompt-blueprint';
import {frameworkLibrary,sceneFrameworks} from '../data/framework-library';
import {promptFrameworks} from '../data/prompt-frameworks';
import {categories} from '../data/categories';
import { builtin } from '../lib/solutions';
import { validateSolution } from '../lib/validation';
const errors = builtin.flatMap(s => validateSolution(s).map(e => s.slug + ': ' + e));
if (new Set(builtin.map(s => s.id)).size !== builtin.length || new Set(builtin.map(s => s.slug)).size !== builtin.length)
    errors.push('重复 id/slug');
for(const category of categories)for(const scene of category.scenes)if(!sceneFrameworks[scene])errors.push('场景缺少框架推荐：'+scene);
for(const solution of builtin){
 const blueprint=getBlueprint(solution.slug);
 if(!blueprint)errors.push(solution.slug+': 缺少结构化提示词');
 else if(compileBlueprint(blueprint)!==solution.solutionContent)errors.push(solution.slug+': 模板与结构源不一致');
 for(const text of [solution.solutionContent,...(solution.promptVariants??[]).map(v=>v.content)])errors.push(...promptWritingErrors(text).map(error=>solution.slug+': '+error));
 const selected=promptFrameworks[solution.slug];
 if(!selected){errors.push(solution.slug+': 缺少框架映射');continue;}
 const definition=frameworkLibrary[selected.name as keyof typeof frameworkLibrary];
 if(!definition){errors.push(solution.slug+': 未注册框架');continue;}
 if(JSON.stringify(selected.groups.map(g=>g.code))!==JSON.stringify(definition.modules.map(m=>m.code)))errors.push(solution.slug+': 框架模块不一致');
 const keys=selected.groups.flatMap(g=>g.keys);
 if(new Set(keys).size!==keys.length||solution.variables.some(v=>!keys.includes(v.key))||keys.some(k=>!solution.variables.some(v=>v.key===k)))errors.push(solution.slug+': 框架字段映射不完整或重复');
 for(const group of selected.groups)if(!group.keys.length&&!group.preset.trim())errors.push(solution.slug+': 空框架模块 '+group.code);
}
if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
}
console.log(builtin.length + ' 个方案通过 Draft 2020-12 及语义校验');
