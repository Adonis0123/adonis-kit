# react-utils-packages 发包与发布流程

本文档覆盖两条发布链路：

1. npm 包发布（`@react-utils/layouts`、`@react-utils/ui`）
2. shadcn Registry 发布（`/registry.json`、`/r/*.json`）

## 1. 发布目标

- npm 安装：
  - `pnpm add @react-utils/layouts`
  - `pnpm add @react-utils/ui`
- shadcn 安装：
  - URL 模式：`pnpm dlx shadcn@latest add https://<your-domain>/r/button.json`
  - 命名空间模式：`pnpm dlx shadcn@latest add @react-utils/button`

## 2. 一次性准备

### 2.1 GitHub Secrets

在仓库 `Settings -> Secrets and variables -> Actions` 配置：

- `NPM_TOKEN`：npm 发布 token（建议 npm automation token）
- `GITHUB_TOKEN`：由 GitHub Actions 自动提供

### 2.2 Vercel 配置

- Root Directory: `apps/web`
- Build Command: `pnpm turbo run build --filter=web`
- 确认公网可访问：
  - `https://<your-domain>/registry.json`
  - `https://<your-domain>/r/button.json`

### 2.3 域名占位符替换

将以下文件内的 `https://react-utils.vercel.app` 改成你的真实域名：

- `apps/web/components.json`
- `apps/web/registry.json`
- `registry.json`

## 3. 日常发布（推荐：CI 自动）

### 步骤 1：开发与本地验证

在仓库根目录执行：

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
```

### 步骤 2：生成 Registry 产物

```bash
pnpm registry:build
```

该命令会生成：

- `apps/web/public/r/*.json`
- `apps/web/public/registry.json`

### 步骤 3：生成 changeset（仅 npm 包变更需要）

```bash
pnpm changeset
```

选择受影响包（如 `@react-utils/ui` / `@react-utils/layouts`）和版本级别（patch/minor/major）。

### 步骤 4：提交并发起 PR

```bash
git add .
git commit -m "feat(ui): add/update ..."
git push
```

### 步骤 5：合并到 `main`

- 合并后触发 `.github/workflows/release.yml`
- 工作流会执行：
  - `pnpm install --frozen-lockfile`
  - `pnpm turbo run build --filter=@react-utils/layouts --filter=@react-utils/ui`
  - `changesets/action`

### 步骤 6：Changesets 自动发布行为

- 如果存在未消费的 changeset：先生成/更新 Release PR
- 合并 Release PR 后：自动执行 npm publish

## 4. 手动发布（兜底流程）

仅在 CI 不可用时使用。

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
pnpm registry:build
pnpm version-packages
git add .
git commit -m "chore(release): version packages"
git push --follow-tags
pnpm release
```

## 5. 发布后验收

### npm 验收

```bash
pnpm -C packages/ui pack
pnpm -C packages/layouts build
```

检查 npm 页面是否出现新版本：

- `@react-utils/ui`
- `@react-utils/layouts`

### Registry 验收

验证以下 URL 可访问：

- `https://<your-domain>/registry.json`
- `https://<your-domain>/r/button.json`
- `https://<your-domain>/r/card.json`

并在临时项目执行：

```bash
pnpm dlx shadcn@latest add https://<your-domain>/r/button.json
```

## 6. 常见问题

### Q1: `NPM_TOKEN is not set`

- 检查 GitHub Actions Secret 是否配置到当前仓库
- token 是否具有对应 scope 的 publish 权限

### Q2: Release workflow 失败但 web 可正常构建

- 当前 release workflow 只构建可发布包（`layouts`/`ui`）
- 请先修复包构建问题，不需要先修复 web 展示问题

### Q3: shadcn add 404

- 先执行 `pnpm registry:build`
- 再检查 `apps/web/public/r/*.json` 是否被提交并部署
- 检查 `components.json` 里的 registry 域名是否为线上真实域名

## 7. 推荐分支策略

- 功能开发：`feature/*`
- 发版由 `main` 驱动（changesets 自动模式）
- 避免直接在 `main` 手工改版本号

