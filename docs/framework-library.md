# 提示词框架库与场景创建

## 定义与来源

统一注册16种：ICIO、CRISPE、BROKE、APE、COAST、TAG、RISE、TRACE、ERA、CARE、ROSES、RACE、PATFU，以及已使用的CO-STAR、RISEN、RTF。

定义见 data/framework-library.json，包含模块、含义、特点、检查点和来源说明。各社区缩写可能存在版本差异，本项目固定 definitionVersion=1，不把缩写视作行业标准或模型效果保证。

ICIO 的输入模块内部键为 ID；ROSES 两个 S 分别记为 S 和 S2，以免覆盖；CRISPE 能力角色用 C/R。PATFU 使用 Area（领域），保留用户提供作者口袋君的说明，未独立核验归属。BROKE 保留用户提供的陈财猫归属和原文链接，链接本次不可读取。来源链接仅作参考，不自动作为首创归属证明。

## 选择规则

data/framework-library.ts 为全部31个二级场景提供主框架和理由。优先分析任务需求：迭代 → PATFU或BROKE；复杂步骤 → RISEN；多方向创意 → CRISPE；样例约束 → CARE；然后使用具体场景推荐；未登记新场景回退 RACE 作为待审核建议。推荐不自动替换已批准的方案，不限制一级场景只能用一种框架。

现有8个任务保留：PPT策划和演讲稿CO-STAR；汇报RACE；评价TRACE；合并和销售分析RISEN；会议RTF；选题CRISPE。复杂汇报可以在RACE中补充分步处理，无需为了加入步骤机械更换名字。

APE、TAG、ERA用于简短直接任务；COAST用于情境沟通；RISE用于流程；ICIO用于资料处理；CARE用于参考式改写；ROSES用于活动或业务方案；BROKE用于关键结果与迭代；PATFU用于专业问题和版本反馈。框架名称不是必须让用户学习的操作门槛。

## 新场景必须完成的配置

1. 明确真实任务、输入、结果、验收和风险，再调用 recommendFramework 得到建议。
2. 通过 createFrameworkPrompt 显式提供所选框架每个模块的字段或预置规则、开场任务、交付要求、领域处理规则和验收要求。不允许模块丢失、未知或重复字段。
3. 把返回 framework 注册到 data/prompt-frameworks.ts，template 作为方案 solutionContent。字段问题与框架模块一致，按用户自然语言组织，不把字母和表单标签机械拼到复制文本。
4. 在 form-guidance.ts 和 framework-explanations.ts 增加该场景的填写顺序、特点和使用方法；完整示例填写同一组字段，通过同一模板渲染。
5. 流程、计算、来源、隐私、权限等业务规则由维护者明确，不由框架名称自动猜测。默认规则仅补充用户未约定部分。需要迭代不代表强制多轮确认或伪造已完成试验。
6. 如有分支，显式配置 promptVariants 和条件字段。增加真实可核对的材料、成果例子和边界测试。新方案保持draft。
7. 运行 validate-content、typecheck、lint、test、build。内容验证会检查已注册方案的框架存在、模块完整及字段一一覆盖。

## 创建示例：ICIO摘要提取

```ts
const created = createFrameworkPrompt({
 name: 'ICIO', reason: '从资料提取摘要并保留出处',
 fields: [{key:'task',label:'提取任务'}, {key:'context',label:'用途与对象'}, {key:'source',label:'原始材料'}, {key:'output',label:'输出要求'}],
 bindings: {I:{keys:['task']}, C:{keys:['context']}, ID:{keys:['source']}, O:{keys:['output']}},
 opening: '请按以下要求整理材料摘要，保留事实、限制条件及出处。',
 output: '{{output}}；交付摘要、关键依据与待确认项。',
 rules: ['先识别主题和事实，再按任务筛选内容。', '保留原文段落编号；结论对应来源，不把观点写成事实。', '不得通过压缩删除会改变结论的限制条件。'],
 acceptance: ['摘要回应用途', '关键结论可追溯至原文', '未新增事实']
});
```

复制输出统一为自然任务指令、输入材料、输出要求、处理规则。各框架的逻辑通过模块绑定、领域规则和交付检查落实，不要求复制文本展示框架首字母。

## 测试范围

结构测试覆盖16框架可生成并安全替换变量、31场景匹配、现有8方案一致性和缺失模块拒绝创建。此类检查不等于外部AI输出效果实测。
