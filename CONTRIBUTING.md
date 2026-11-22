# 参与即用

欢迎贡献具体工作场景、提示词、结果案例和界面改进。

## 开发检查

Node.js 22 LTS，使用 `npm ci` 安装锁定依赖。提交前运行：

```sh
npm run validate-content
npm run typecheck
npm run lint
npm test
npm run build
```

## 新增场景

1. 在 `content/solutions/` 添加 JSON，满足 `schemas/solution.schema.json`。
2. 通过 `lib/solutions.ts` 注册内容，使用 `data/categories.ts` 里的分类。
3. 在 `data/prompt-frameworks.ts`、`data/form-guidance.ts`、`data/framework-explanations.ts` 配置框架、填写顺序和说明。
4. 提供编号明确的材料、可核对结果及完整案例填写值。示例不能冒充客户成果或模型实测。
5. 默认值仅补充未填写项目。按选择输出适用分支，保留必要核验和工具能力边界。

未经实际外部测试的方案保持 `draft`，不要伪造验证记录。提交中不要包含密钥、个人资料、真实客户材料或未经许可的图片。

## 提交说明

说明解决的问题、修改后的行为和检查结果。界面修改请附桌面及手机截图。新增规则应包含正常、缺失输入和边界情况的测试。

新增场景须先阅读 [框架库与场景创建](docs/framework-library.md)，完成框架模块、表单字段、完整案例和交付核验的一致配置。
