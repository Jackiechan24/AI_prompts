import {it,expect} from 'vitest';
import {search} from '@/lib/search';
import {builtin} from '@/lib/solutions';
it('任务别名与常见问法匹配具体场景',()=>{for(const [q,slug] of [['老板让我做汇报','report-content-organization'],['合并Excel','excel-multi-sheet-merge'],['把多张表汇总到一起','excel-multi-sheet-merge'],['录音转文字整理成纪要','meeting-notes-action-items'],['小红书不知道发什么','xiaohongshu-topic-planning']])expect(search(builtin,new URLSearchParams({q}))[0]?.slug).toBe(slug)});
it('口语查询仍遵守筛选且不召回无关内容',()=>{expect(search(builtin,new URLSearchParams({q:'老板让我做汇报',domain:'数据与表格'}))).toEqual([]);expect(search(builtin,new URLSearchParams({q:'宇宙飞船维修'}))).toEqual([]);expect(search(builtin,new URLSearchParams({q:'合并 excel'}))[0]?.slug).toBe('excel-multi-sheet-merge')});
