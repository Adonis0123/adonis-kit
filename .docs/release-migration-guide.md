# 发布流程迁移指南（面向其他项目）

本文档用于将当前仓库的 Changesets 发布体系迁移到其他仓库，目标是快速复用以下能力：

- 手动选择包与 `patch/minor/major` 生成单发布 PR（`Release Prepare`）
- `push main` 自动发布 npm 包并创建 GitHub Release（`Release`）
- 发布异常后回退 npm `latest` 标签（`Release Rollback`）

## 1. 适用前提

建议目标项目满足：

1. 使用 npm 发包（public package）
2. 已接入 GitHub Actions
3. 最好是 monorepo（非 monorepo 也可迁移，需调整脚本）

## 2. 需要复制的核心文件

从本仓库复制以下文件到目标仓库：

1. `.github/workflows/release.yml`
2. `.github/workflows/release-prepare.yml`
3. `.github/workflows/release-rollback.yml`
4. `scripts/release/create-changeset.mjs`
5. `scripts/release/validate-changeset-config.mjs`

可选复制：

6. 根目录 `package.json` 中脚本别名
   - `release:create-changeset`
   - `release:validate-config`

## 3. 必改配置（迁移时最容易漏）

### 3.1 包白名单

需要同时修改 3 处，保持一致：

1. `release-prepare.yml` 的下拉选项 `inputs.package.options`
2. `create-changeset.mjs` 的 `ALLOWED_PACKAGES`
3. `release.yml` 里 `Build publishable packages` 的 `--filter=<pkg>` 列表

### 3.2 单发布 PR 关键行为

迁移时必须确保 `Release Prepare` 包含：

1. 生成 changeset
2. 执行 `pnpm version-packages`
3. 产出可直接合并的发布 PR（带版本号与 changelog）
4. 并发保护（已有未合并 release PR 时直接失败）

### 3.3 `Release` 行为约束

迁移时必须确保 `Release`：

1. 先做 `.changeset/*.md` 残留检查（有残留直接失败）
2. 使用 `changesets/action@v1` 执行 `publish: pnpm release`
3. 开启 `createGithubReleases: true`
4. 不再执行 `version`（版本变更已由 `Release Prepare` 完成）

### 3.4 分支与权限

根据目标仓库修改：

- `on.push.branches`（`main` 或 `master`）
- `release-prepare.yml` 中 open release PR 检查的 `base`（应与目标默认分支一致，建议使用 `github.event.repository.default_branch`，避免硬编码）
- `permissions`（建议最小化）
- `concurrency`（避免重复发布任务竞争）

### 3.5 构建与测试命令

若目标仓库不是 `pnpm + turbo`，需替换：

- `pnpm install --frozen-lockfile`
- `pnpm turbo run build --filter=<pkg-a> --filter=<pkg-b> ...`
- 单包测试命令（如存在）

## 4. Secrets 配置

目标仓库 `Settings -> Secrets and variables -> Actions` 至少需要：

- `NPM_TOKEN`
- `GITHUB_TOKEN`（通常默认可用）

同时需要开启 Actions PR 权限：

- `Settings -> Actions -> General -> Workflow permissions = Read and write permissions`
- `Allow GitHub Actions to create and approve pull requests`

## 4.1 Changesets 私有包配置（必配）

在 `.changeset/config.json` 设置：

```json
{
  "changelog": "@changesets/cli/changelog",
  "privatePackages": {
    "version": false,
    "tag": false
  }
}
```

否则可能出现：

- 私有包被升版并触发 `ENOENT .../CHANGELOG.md`（如 `apps/web/CHANGELOG.md`）
- 或因 `changelog: false` 导致发布包缺少 `CHANGELOG.md`

## 5. 推荐迁移步骤

1. 新建迁移分支并复制文件
2. 修改白名单、路径映射、构建命令、分支策略
3. 提交 PR 并完成代码评审
4. 合并后手动运行一次 `Release Prepare`
5. 确认生成的发布 PR 已包含版本号与 changelog 变更
6. 合并发布 PR，确认 `Release` 完成 npm publish + GitHub Release
7. 在非生产包上演练一次 `Release Rollback`

## 6. 验收标准

满足以下条件即视为迁移成功：

1. `Release Prepare` 可创建单发布 PR（不是 only-changeset PR）
2. 发布 PR 中含目标包版本号与 changelog 更新
3. 合并发布 PR 后 `Release` 可完成 npm 发布
4. 发布后仓库可看到自动生成的 GitHub Release
5. `Release Rollback` 可恢复 `latest` 到指定历史版本

## 7. 常见迁移问题

### Q1：仍然一直是 `0.0.0`

根因通常是混淆了根包版本与子包版本。根目录版本不会跟随 npm 子包发布变化。请检查 `packages/*/package.json`。

### Q2：Workflow 校验报 YAML 类型错误

包含 `:` 的字符串建议使用双引号包裹，例如：

```yaml
title: "chore(release): prepare ${{ inputs.package }} (${{ inputs.bump }})"
```

### Q3：`Release` 报 `Found unconsumed changeset files`

说明主分支存在未消费 `.changeset/*.md`。请通过 `Release Prepare -> version-packages -> PR` 的标准路径重新生成发布 PR。

### Q4：回退失败

先确认版本存在：

```bash
npm view <package>@<version> version
```

再确认 `NPM_TOKEN` 是否有 dist-tag 权限。

## 8. 约束说明

- 当前方案是“单包准备发布”，一次只处理一个包
- 回退策略是“安全回退”：仅改 `latest` dist-tag，不删除已发布版本
- 新增发布包时，必须同步更新 workflow 和脚本中的白名单
