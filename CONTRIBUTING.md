# 代码贡献规范

有任何疑问，欢迎提交 [issue](https://github.com/txd-team/docsite/issues)，
或者直接修改提交 [PR](https://github.com/txd-team/docsite/pulls)!

## 代码提交

### 代码风格

你的代码风格必须通过 eslint，你可以运行 `$ npm run lint` 本地测试。

### Commit 提交规范

commit message 需要命名统一为：

```xml
<type>(<scope>): <subject>
<BLANK LINE>
<body>
```

1. type — 提交 commit 的类型
  ○ feat: 新功能
  ○ fix: 修复问题
  ○ docs: 修改文档
  ○ style: 修改代码格式，不影响代码逻辑
  ○ refactor: 重构代码，理论上不影响现有功能
  ○ perf: 提升性能
  ○ test: 增加修改测试用例
  ○ chore: 修改工具相关（包括但不限于文档、代码生成等）
  ○ deps: 升级依赖

2. scope — 修改文件的范围，可选，包括但不限于 doc / plugins 等。

3. subject — 用一句话清楚的描述这次提交做了什么。

4. body - 可选，补充的说明

- **当有非兼容修改(Breaking Change)时必须在这里描述清楚**
- 关联相关 issue，如 `Closes #1, Closes #2, #3`
- 如果功能点有新增或修改的，还需要关联文档 `doc` 的 PR，如 `txd-team/docsite-doc-v1#123`

## 文档编写

> 文档的代码仓库为：https://github.com/txd-team/docsite-doc-v1

文档是一个 docsite 创建的项目示例，所有功能点必须提交配套文档，文档须满足以下要求

- 描述清楚操作的步骤，以及需要准备的前置工作。
- 提供必要的链接，如申请流程，术语解释和参考文档等。
- 同步修改中英文文档，或者在 PR 里面说明。

## 版本发布

遵循 [Semantic Version](https://semver.org/) 规范，次要版本号的最后一个版本提交 tag 以备份
