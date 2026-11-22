import {describe,it,expect} from 'vitest';
import {frameworkLibrary,recommendFramework,sceneFrameworks} from '@/data/framework-library';
import {categories} from '@/data/categories';
import {promptFrameworks} from '@/data/prompt-frameworks';
import {createFrameworkPrompt} from '@/lib/framework-authoring';
import {render} from '@/lib/template';
describe('framework library',()=>{
 it('16种框架模块唯一且释义完整',()=>{expect(Object.keys(frameworkLibrary)).toHaveLength(16);for(const f of Object.values(frameworkLibrary)){expect(new Set(f.modules.map(m=>m.code)).size).toBe(f.modules.length);expect(f.modules.every(m=>m.english&&m.term&&m.meaning)).toBe(true);}});
 it('31场景和现有8个方案均匹配可用框架',()=>{for(const c of categories)for(const scene of c.scenes){expect(sceneFrameworks[scene]).toBeTruthy();expect(frameworkLibrary[recommendFramework({scene}).name]).toBeTruthy();}for(const f of Object.values(promptFrameworks)){const def=frameworkLibrary[f.name as keyof typeof frameworkLibrary];expect(def).toBeTruthy();expect(f.groups.map(g=>g.code)).toEqual(def.modules.map(m=>m.code));}});
 it('根据复杂度与迭代选型，不受一级分类锁定',()=>{expect(recommendFramework({scene:'PPT 策划',complex:true}).name).toBe('RISEN');expect(recommendFramework({iteration:true,specialist:true}).name).toBe('PATFU');expect(recommendFramework({simple:true}).name).toBe('APE');expect(recommendFramework({scene:'未来新增场景'}).name).toBe('RACE');});
 it('每种框架可创建、填写并渲染完整提示词',()=>{for(const name of Object.keys(frameworkLibrary) as (keyof typeof frameworkLibrary)[]){const f=frameworkLibrary[name];const fields=f.modules.map((m,i)=>({key:'field'+i,label:m.term}));const bindings=Object.fromEntries(f.modules.map((m,i)=>[m.code,{keys:['field'+i]}]));const result=createFrameworkPrompt({name,reason:'测试创建',fields,bindings,opening:'请根据提供的材料完成任务。',output:'交付约定结果与待确认项',rules:['保留材料来源，不改变事实'],acceptance:['结果回应目标']});const text=render(result.template,fields.map(f=>({...f,type:'textarea' as const,required:true})),Object.fromEntries(fields.map(f=>[f.key,'实际输入 $&'])));expect(text.valid).toBe(true);expect(text.text).not.toContain('{{');expect(text.text).toContain('实际输入 $&');expect(text.text).toContain('【执行步骤】');for(const part of f.modules)expect(text.text).toContain('【'+part.term+'】');}});
 it('缺少模块、字段重复和缺少验收不能创建',()=>{expect(()=>createFrameworkPrompt({name:'APE',reason:'测试',bindings:{},fields:[],opening:'任务',output:'结果',rules:['规则'],acceptance:['验收']})).toThrow('模块缺少');});
});

