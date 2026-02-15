# Release Workflow 迁移检查清单

## A. 文件迁移

- [ ] 复制 `.github/workflows/release.yml`
- [ ] 复制 `.github/workflows/release-prepare.yml`
- [ ] 复制 `.github/workflows/release-rollback.yml`
- [ ] 复制 `scripts/release/create-changeset.mjs`
- [ ] 复制 `scripts/release/validate-changeset-config.mjs`

## B. 白名单与路径

- [ ] 更新 `release-prepare.yml` 中 `package` 下拉选项
- [ ] 更新 `create-changeset.mjs` 中 `ALLOWED_PACKAGES`
- [ ] 更新 `release.yml` 中 `Build publishable packages` 的 `--filter=<pkg>` 列表

## C. 命令适配

- [ ] 构建命令已适配（pnpm/turbo 或其他）
- [ ] 单包测试命令已适配或移除
- [ ] 根目录 `package.json` 已补充可选调试脚本（如需要）
- [ ] 发布前配置校验命令已接入 workflow（`validate-changeset-config.mjs`）

## D. 平台配置

- [ ] `on.push.branches` 与目标默认分支一致
- [ ] `permissions` 满足最小权限要求
- [ ] `concurrency` 策略符合团队约定
- [ ] Actions Secrets 已配置 `NPM_TOKEN`
- [ ] `Workflow permissions` 已设为 `Read and write permissions`
- [ ] 已启用 `Allow GitHub Actions to create and approve pull requests`

## E. Changesets 配置

- [ ] `.changeset/config.json` 已设置 `changelog = "@changesets/cli/changelog"`
- [ ] `.changeset/config.json` 已设置 `privatePackages.version = false`
- [ ] `.changeset/config.json` 已设置 `privatePackages.tag = false`

## F. 验证流程

- [ ] 手动跑 `Release Prepare`，并生成 changeset PR
- [ ] 合并后 `Release` 创建/更新版本 PR
- [ ] 合并版本 PR 后发布成功
- [ ] `Release Rollback` 可回退 `latest` 到指定历史版本

## G. 回归与风险

- [ ] 每次发布都会构建发布白名单包（保守稳定策略）
- [ ] 白名单外包不会被误发布
- [ ] 团队明确“安全回退 = 仅修改 dist-tag，不 unpublish”
