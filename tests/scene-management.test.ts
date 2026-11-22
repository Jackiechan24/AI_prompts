import {it,expect} from 'vitest';
import {initialCatalog,validCatalog,renameScene} from '@/lib/scene-catalog';
import {builtin} from '@/lib/solutions';
import {newPrompt} from '@/lib/new-prompt';
import {validateSolution} from '@/lib/validation';
it('默认目录保持八类31场景并接受持久化往返',()=>{expect(initialCatalog.categories).toHaveLength(8);expect(initialCatalog.categories.flatMap(c=>c.scenes)).toHaveLength(31);expect(validCatalog(JSON.parse(JSON.stringify(initialCatalog)))).toBe(true);});
it('重命名并移动场景同步更新已有提示词归属，不修改内置内容',()=>{const source=builtin.find(s=>s.category==='PPT 策划')!;const next=renameScene(initialCatalog,builtin,'PPT 策划','演示策划','writing');expect(validCatalog(next)).toBe(true);expect(next.placements[source.id]).toEqual({domain:'文档与写作',category:'演示策划'});expect(next.categories.find(c=>c.slug==='presentation')!.scenes).not.toContain('PPT 策划');expect(initialCatalog.categories[0].scenes).toContain('PPT 策划');});
it('拒绝重复类别、跨类别重名场景及悬空归属',()=>{const bad=structuredClone(initialCatalog);bad.categories[1].scenes.push(bad.categories[0].scenes[0]);expect(validCatalog(bad)).toBe(false);expect(validCatalog({...initialCatalog,placements:{x:{domain:'不存在',category:'不存在'}}})).toBe(false);expect(()=>renameScene(initialCatalog,builtin,'PPT 策划','销售分析','data')).toThrow();});
it('自定义场景新增提示词通过完整结构校验，保持草稿未实测',()=>{const catalog=structuredClone(initialCatalog);catalog.categories[0].scenes.push('述职准备');const s=newPrompt({id:'test-123',title:'述职整理',body:'请整理提供的工作记录，输出重点与证据。',domain:catalog.categories[0].name,category:'述职准备'});expect(validateSolution(s,catalog.categories)).toEqual([]);expect(validateSolution(s)).toContain('/category 未知领域或场景');expect(s.validationRecords).toEqual([]);expect(s.qualityStatus).toBe('draft');expect(s.resultExample.workedExample).toBeUndefined();});
