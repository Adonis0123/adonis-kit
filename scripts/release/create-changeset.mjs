import { appendFileSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const ALLOWED_PACKAGES = new Map([
  ['@adonis-kit/react-layouts', 'react-layouts'],
  ['@adonis-kit/ui', 'ui'],
])

const ALLOWED_BUMPS = new Set(['patch', 'minor', 'major'])

function fail(message) {
  console.error(`[create-changeset] ${message}`)
  process.exit(1)
}

function writeOutput(key, value) {
  const outputPath = process.env.GITHUB_OUTPUT
  if (!outputPath) {
    return
  }

  appendFileSync(outputPath, `${key}=${value}\n`)
}

const releasePackage = process.env.RELEASE_PACKAGE
const releaseBump = process.env.RELEASE_BUMP
const releaseSummary = (process.env.RELEASE_SUMMARY ?? 'manual release via workflow_dispatch').trim()
const runId = process.env.RUN_ID ?? `${Date.now()}`
const runAttempt = process.env.RUN_ATTEMPT ?? '1'

if (!releasePackage || !ALLOWED_PACKAGES.has(releasePackage)) {
  fail(`Invalid RELEASE_PACKAGE: ${releasePackage ?? '(empty)'}`)
}

if (!releaseBump || !ALLOWED_BUMPS.has(releaseBump)) {
  fail(`Invalid RELEASE_BUMP: ${releaseBump ?? '(empty)'}`)
}

const normalizedSummary = releaseSummary.length > 0 ? releaseSummary : 'manual release via workflow_dispatch'
const slug = ALLOWED_PACKAGES.get(releasePackage)
const fileName = `release-${slug}-${runId}-${runAttempt}.md`
const changesetDir = path.resolve('.changeset')
const filePath = path.join(changesetDir, fileName)
const relativePath = path.posix.join('.changeset', fileName)
const frontmatter = `---\n"${releasePackage}": ${releaseBump}\n---`
const content = `${frontmatter}\n\n${normalizedSummary}\n`

await mkdir(changesetDir, { recursive: true })
await writeFile(filePath, content, 'utf8')

writeOutput('changeset_path', relativePath)
writeOutput('package_slug', slug)
console.log(`[create-changeset] created ${relativePath}`)
