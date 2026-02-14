import { cp, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * 同步 Claude skills 目录：
 * 1) 从 `.agents/skills` 读取技能源目录；
 * 2) 先清空 `.claude/skills`，再进行全量复制；
 * 3) 输出同步数量与路径，供 postinstall 日志排查使用。
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const sourceDir = path.join(repoRoot, ".agents", "skills");
const targetDir = path.join(repoRoot, ".claude", "skills");

async function ensureSourceExists() {
	const sourceStats = await stat(sourceDir).catch(() => null);
	if (!sourceStats?.isDirectory()) {
		console.error(`[skills:sync:claude] Source directory not found: ${sourceDir}`);
		process.exit(1);
	}
}

async function syncSkills() {
	// 源目录不存在时立即失败，避免误删目标目录。
	await ensureSourceExists();
	// 保持目标目录与源目录完全一致：先删后拷。
	await rm(targetDir, { recursive: true, force: true });
	await cp(sourceDir, targetDir, { recursive: true, force: true });

	// 输出简要统计，便于在 postinstall 中快速确认同步结果。
	const entries = await readdir(sourceDir, { withFileTypes: true });
	const skillCount = entries.filter((entry) => entry.isDirectory()).length;

	console.log(`[skills:sync:claude] Synced ${skillCount} skills`);
	console.log(`[skills:sync:claude] ${sourceDir} -> ${targetDir}`);
}

syncSkills().catch((error: unknown) => {
	// 异常时使用非零退出码，确保 CI/安装流程可感知失败。
	console.error("[skills:sync:claude] Failed to sync skills");
	console.error(error);
	process.exit(1);
});
