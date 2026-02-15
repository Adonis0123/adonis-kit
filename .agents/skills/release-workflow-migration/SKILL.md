---
name: release-workflow-migration
description: Use when migrating this repository's Changesets release workflow (Release, Release Prepare, Release Rollback) to another project. Includes package whitelist adaptation, workflow setup, script migration, and validation checklist.
version: 1.0.0
---

# Release Workflow Migration

将本仓库的 Changesets 定向发包流程迁移到其他项目时，使用本 Skill。

## 适用场景

- 用户要求将当前发布流程迁移到另一个仓库
- 用户要求复用 `Release Prepare` + `Release` + `Release Rollback`
- 用户要求支持按包选择发版与失败后的安全回退

## 迁移目标

在目标仓库落地以下能力：

1. 手动准备发布：选择包和 `patch/minor/major`，自动生成 changeset 并开 PR
2. 自动发布：`push` 到主分支后，固定构建发布白名单包并执行 Changesets 两阶段发布
3. 安全回退：仅回退 npm `latest` dist-tag，不执行 `unpublish`

## 必需输入

开始迁移前，先确认：

1. 目标仓库的包管理器（默认 `pnpm`）
2. 目标仓库的构建命令（默认 `pnpm turbo run build`）
3. 发布包白名单（npm 包名 + 目录前缀）
4. 默认分支名称（默认 `main`）
5. 是否需要单包测试步骤
6. 是否已允许 GitHub Actions 创建 PR（Release Prepare 必需）

## 实施步骤

### 1. 复制基础文件

复制以下文件到目标仓库：

- `.github/workflows/release.yml`
- `.github/workflows/release-prepare.yml`
- `.github/workflows/release-rollback.yml`
- `scripts/release/create-changeset.mjs`
- `scripts/release/validate-changeset-config.mjs`

### 2. 替换白名单配置

至少同步修改以下位置：

1. `release-prepare.yml` 的 `workflow_dispatch.inputs.package.options`
2. `create-changeset.mjs` 的 `ALLOWED_PACKAGES`
3. `release.yml` 的 `Build publishable packages` 中 `--filter=<pkg>` 列表

### 3. 校正构建与测试命令

默认命令：

- 配置校验：`node scripts/release/validate-changeset-config.mjs`
- 自动发布构建：`pnpm turbo run build --filter=<pkg-a> --filter=<pkg-b> ...`
- 手动准备发布构建：`pnpm turbo run build --filter=<package>`
- 单测（示例）：`pnpm -C packages/react-layouts test`

如果目标仓库不是 pnpm/turbo，替换为对应命令。

### 4. 校正分支与权限

检查以下项并按目标仓库策略调整：

- `on.push.branches`
- `permissions`
- `concurrency`
- `Settings -> Actions -> General -> Workflow permissions = Read and write permissions`
- `Allow GitHub Actions to create and approve pull requests`

### 5. 校正 Changesets 私有包策略

在 `.changeset/config.json` 添加并确认：

```json
{
  "changelog": "@changesets/cli/changelog",
  "privatePackages": {
    "version": false,
    "tag": false
  }
}
```

目的：

- 确保 `changesets/action` 可读取发布包 changelog
- 避免私有 workspace 包被 `changeset version` 误升版
- 防止出现 `ENOENT .../CHANGELOG.md`

### 6. 配置 Secrets

目标仓库至少需要：

- `NPM_TOKEN`
- `GITHUB_TOKEN`（Actions 默认提供）

### 7. 执行验证

按顺序验证：

1. 运行 `Release Prepare`（单包 + patch）
2. 确认自动 PR 包含 `.changeset/*.md`
3. 合并后确认 `Release` 创建/更新版本 PR
4. 合并版本 PR 后确认 npm 发布成功
5. 运行 `Release Rollback`，确认 `latest` 可恢复到指定历史版本

## 交付标准

迁移完成时输出：

1. 变更文件清单
2. 白名单映射（包名 -> 路径）
3. 验证结果（3 条 workflow）
4. 风险与限制（例如暂不支持多包一次发布）

## 参考

- 迁移文档：`.docs/release-migration-guide.md`
- 流程文档：`.docs/release-workflow.md`
- 检查清单：`references/migration-checklist.md`
