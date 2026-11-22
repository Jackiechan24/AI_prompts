import {it,expect} from 'vitest';import {pptRequirements} from '../lib/ppt-requirements';
it('五项必填只检查非空',()=>{expect(Object.keys(pptRequirements({}))).toHaveLength(5);expect(pptRequirements({task:'做一个PPT'}).task).toBeUndefined();});
it('自然填写不要求固定标签',()=>{expect(pptRequirements({objective:'帮助掌握流程',mode:'完整逐页策划',task:'新员工培训，帮助掌握流程',audience:'新人现场听，15分钟',materials:'只有主题',delivery:'逐页内容'})).toEqual({});});
