# 即用 Jiyong

**把需求说清楚，让 AI 更好地帮你。**

面向具体工作场景的提示词方案平台：先看成果案例，按中文问题填写需求，再复制完整提示词到外部 AI 工具执行。

提供 Next.js 网页源码，无需模型 API Key、数据库或登录。

## 功能

- 搜索任务，按八类核心场景与二级场景筛选。
- 查看材料、结果与案例完整提示词。
- 场景适配 CO-STAR、RACE、RISEN、TRACE、RTF、CRISPE。
- 选填默认值、条件必填与合并分支，保留用户原文。
- 一键复制、本地收藏；站内不调用模型、不执行文件处理。

内置31个场景方案，覆盖8类核心场景；每个方案含匹配框架、填写模板、编号材料、结果示例与完整提示词。尚未完成外部 AI 效果实测，不保证模型输出。

## 网页启动

使用 Node.js 22 LTS，在项目根目录执行：

    npm ci
    npm run dev

打开 http://localhost:3000 。生产运行：

    npm run build
    npm start

构建采用 Webpack，避免部分 Windows 环境的 Turbopack 子进程故障。

默认显示草稿示例。NEXT_PUBLIC_CONTENT_MODE=production 只显示 published；目前没有已发布内容，会显示空状态。见 .env.example。

## 项目结构

- app/、components/：网页路由、样式与组件。
- content/solutions/：场景方案与案例。
- data/：分类、框架与表单说明。
- lib/、schemas/：模板、分支与内容校验。
- scripts/、tests/：检查、打包与测试。

/admin 只修改当前浏览器数据，不是认证后台。导出 JSON 后由维护者审核回写源码。收藏不跨设备同步，填写内容不持久保存。

## 检查与贡献

    npm run validate-content
    npm run typecheck
    npm run lint
    npm test
    npm run build

欢迎贡献具体场景、规则、案例和使用反馈，见 [贡献指南](CONTRIBUTING.md)。

## 开源发布

见 [GitHub 发布步骤](docs/open-source-release.md)。npm run release:source 生成排除依赖、构建产物、日志和私有配置的源码目录与ZIP。

源码仓库：[Jackiechan24/AI_prompts](https://github.com/Jackiechan24/AI_prompts)。在线演示将在实际部署后补充。

原创代码采用 [MIT](LICENSE)。第三方依赖、图标和参考材料见 [第三方声明](THIRD_PARTY_NOTICES.md)。
