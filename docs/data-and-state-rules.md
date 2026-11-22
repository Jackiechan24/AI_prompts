# 数据与状态规则

## 数据来源与身份
- `content/solutions/*.json` 为唯一内置方案源；schema 使用 JSON Schema Draft 2020-12，开发时同时执行结构校验和语义校验。
- 规范字段为 deliveryTypes（数组），不再另设 deliveryType；执行顺序由正文及 stages 表达，不新增重复的 promptTemplate 数据源。
- id 与 slug 全局唯一；id 用于收藏、最近使用和本地覆盖，slug 用于路由。分类映射由应用静态配置维护，覆盖当前三领域及其场景。
- 管理保存后的有效数据 = 内置方案按 id 合并本地覆盖 + 本地新增方案。内置身份不可变；未知分类不允许保存，应先更新静态分类配置。
- 浏览器首次加载先呈现加载状态，合并本地数据后再展示列表、详情和收藏；服务端不得访问 localStorage。

## Schema 与附加语义校验
- 非空字符串还必须拒绝纯空白；数组中的正文条目同样检查。testedAt 为真实最近测试日期或 null；testNotes 保留尚未测试的说明。
- variable key、stage id 在所属方案中唯一；模板仅允许 `{{key}}` 占位符，不支持表达式、嵌套或代码执行。所有占位符必须有变量定义，每个变量必须在主正文或阶段正文中使用。
- select 默认值为合法选项字符串；multiselect 默认值为无重复的合法选项数组；number 为有限数字，date 为有效日期字符串，text/textarea 为字符串。缺省默认值按类型为空，不自动选择首项。
- 可选变量必须配置 emptyBehavior=omitLine 或 omitParagraph。omitLine 删除该变量所在整行；omitParagraph 删除以空白行分隔的整段。该块不得包含必填变量或其他变量，避免误删；同一可选变量可以出现在多个独立块。
- 含“多阶段提示词”时必须有至少两个 stages；每阶段包含 id、title、instructions、content。其 solutionContent 为独立可读的总体模板，仅用于内容编辑与总体参考；用户复制以 stages 为唯一来源，避免重复输出。
- 所有正文在 JSON 解析后必须含真实换行，不得以字面量反斜杠 n 代替排版换行。

## 拼装顺序
1. 验证变量配置及输入类型，识别缺失必填项。
2. 按空值策略移除可选块；空值为缺省、空字符串、纯空白或空数组，数字 0 不为空。
3. 对剩余模板进行一次占位符替换，使用替换函数，保留中文、换行、美元符号和特殊字符；不递归解释用户输入。
4. 检查未解析占位符及由缺失数据产生的 null/undefined；失败则阻止复制。用户主动输入的正常文字 null/undefined 不应被全局删除。
5. 多阶段分别校验；复制当前阶段仅依赖本阶段变量，复制全部需所有阶段有效。若用户值含占位符样式，为满足无残留规则提示调整输入，禁止复制，不进行二次执行。

## 内容状态与验证
- draft=待验证草稿，testing=测试中，verified=已验证，published=已发布，deprecated=已停用。
- 允许 draft→testing→verified→published；testing 可退回 draft，verified/published 可退回 testing；任意状态可停用，恢复只能回到 draft。
- verified/published 门槛：结构与语义检查通过；normal、incomplete、abnormal、boundary 四类真实测试各至少有一条通过记录，每条五项评分均至少 4；testedAt 等于最新记录日期且无晚于该类通过记录的失败记录。记录应标明实际工具、输入摘要、日期、结果、说明，不含隐私原文。
- 不得将结构校验、UI 测试或人工改状态当成外部执行测试。当前六个样例 validationRecords=[]、testedAt=null、qualityStatus=draft、isDemo=true。
- 修改方案正文、变量、阶段或验收标准后，状态退回 draft、清空有效验证记录与 testedAt，并在 testNotes 说明需重测；历史报告由维护者另行归档。
- 演示模式只显示演示标识，不授予已验证徽标；正式模式只显示 published，已验证徽标仍需门槛检查。停用方案不参与发现，旧链接展示停用提示，禁止复制。

## 本地存储契约
- key：ai-solutions:v1:favorites、ai-solutions:v1:recent、ai-solutions:v1:overrides。值均为 `{version:1,data:...}` JSON。
- favorites 为 id 字符串数组；recent 为 `{id,usedAt}` 数组，usedAt 为 ISO 时间，去重并限制 20 条；overrides 为完整 Solution 数组。
- 解析后进行版本和内容校验；损坏项忽略并告知用户，不自动覆盖损坏原值。版本不支持时不迁移、不覆盖，提供导出原始内容及用户确认后的重置。
- 配额、禁用存储或写入失败时保持内存状态，明确提示刷新会丢失；不能显示持久化保存成功。
- 同源其他标签页通过 storage 事件刷新；并发编辑采用最后一次成功写入，编辑器检测外部变化后提示重新载入，避免静默覆盖。
- 收藏和最近记录中找不到或已停用的方案在显示时过滤；不因此悄悄重写原始存储。
- 恢复内置版本只移除对应覆盖，不删除收藏和最近记录；本地新增内容无内置版本，不提供该操作。MVP 不提供硬删除。

## 导出与维护
- 导出当前通过校验的单方案 UTF-8 JSON，文件名为 slug.json。维护者审核后手动替换 content 文件，再运行内容校验和构建。
- 不将用户表单值、文件、复制文本存入持久存储；反馈文本仅由用户主动复制。
- JSON 导出并非云端发布。所有本地管理状态变更仅对当前浏览器有效。
