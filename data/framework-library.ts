import definitions from './framework-library.json';
export type FrameworkName=keyof typeof definitions;
export type FrameworkModule={code:string;english:string;term:string;meaning:string};
export type FrameworkDefinition={name:string;definitionVersion:number;sourceStatus:string;feature:string;modules:FrameworkModule[];checks:string[];sources?:{url:string;note:string}[];notes?:string};
export const frameworkLibrary:Record<FrameworkName,FrameworkDefinition>=definitions;
export type TaskNeeds={scene?:string;simple?:boolean;process?:boolean;complex?:boolean;examples?:boolean;creative?:boolean;iteration?:boolean;specialist?:boolean};
const sceneRules:Record<string,[FrameworkName,string]>={
 'PPT 策划':['CO-STAR','明确受众、目标、逐页表达和交付'], '汇报内容组织':['RACE','从材料整理结论与依据'], '演讲稿':['CO-STAR','控制听众、语气、时长与稿件'],
 '多表合并':['RISEN','明确映射、分支、连接和对账'], '数据清洗':['RISEN','按规则清洗并保存异常与来源'], '销售分析':['RISEN','先确认业务口径再计算和解释'], '图表制作':['ICIO','明确数据、图表用途与输出'],
 '文档起草':['RACE','明确文档任务、背景和结果'], '改写润色':['CARE','依据样例和原文控制修改'], '摘要提取':['ICIO','对照原文提取并保留依据'], '格式转换':['ICIO','保持信息含义并转换结构'],
 '会议纪要':['RTF','按指定格式忠实提取'], '行动事项':['RTF','按原文提取任务、负责人和期限'], '邮件回复':['CO-STAR','适配对象、目的和语气'], '沟通准备':['COAST','结合对象、情境和目标准备行动'],
 '账号选题':['CRISPE','结合定位与素材探索并筛选'], '内容创作':['CO-STAR','控制受众、目标与表达'], '营销文案':['CO-STAR','对照受众需求组织内容'], '活动策划':['ROSES','明确情境、资源、方案与步骤'],
 '评价分析':['TRACE','以分类标准和样例统一判断'], '客户问题整理':['TRACE','归类追溯原文并排序'], '销售跟进':['COAST','结合客户阶段与情境安排动作'], '方案报价':['ROSES','明确需求、范围、依据和交付方案'],
 '资料检索':['ICIO','指定检索范围、来源及输出'], '行业研究':['RISEN','限定证据和比较口径后分步研究'], '竞品分析':['RISEN','统一维度和来源再比较'], '项目规划':['BROKE','目标、关键结果与改进闭环'],
 '文件归档':['RISE','依据文件材料执行归档流程'], '批量整理':['RISEN','明确批量规则和异常处理'], '操作指南':['RISE','按资源和步骤形成可用指南'], '流程梳理':['RISE','明确输入、步骤、责任和产出']
};
export const sceneFrameworks=sceneRules;
export function recommendFramework(needs:TaskNeeds):{name:FrameworkName;reason:string}{
 if(needs.iteration)return {name:needs.specialist?'PATFU':'BROKE',reason:'需要反馈、验收结果和版本改进'};
 if(needs.complex)return {name:'RISEN',reason:'需要明确步骤、约束与阶段核验'};
 if(needs.creative)return {name:'CRISPE',reason:'需要探索多方向并比较筛选'};
 if(needs.examples)return {name:'CARE',reason:'需要通过参考样例约束输出'};
 if(needs.scene&&sceneRules[needs.scene]){const [name,reason]=sceneRules[needs.scene];return {name,reason};}
 if(needs.process)return {name:'RISE',reason:'需要组织输入、步骤和产出'};
 if(needs.simple)return {name:'APE',reason:'明确行动、目的和期望即可完成'};
 return {name:'RACE',reason:'新场景先明确角色、任务、背景与预期，再补充领域规则'};
}
