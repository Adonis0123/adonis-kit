import { execFileSync } from 'node:child_process'
import { appendFileSync } from 'node:fs'
import process from 'node:process'

const PUBLISHABLE_PACKAGES = [
  {
    name: '@adonis-kit/react-layouts',
    pathPrefix: 'packages/react-layouts/',
  },
  {
    name: '@adonis-kit/ui',
    pathPrefix: 'packages/ui/',
  },
]

const SHARED_TRIGGER_FILES = new Set([
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'turbo.json',
])

function readChangedFiles(beforeSha, currentSha) {
  const isZeroSha = beforeSha ? /^0+$/.test(beforeSha) : true
  const args =
    beforeSha && !isZeroSha
      ? ['diff', '--name-only', `${beforeSha}..${currentSha}`]
      : ['show', '--pretty=format:', '--name-only', currentSha]
  const output = execFileSync('git', args, { encoding: 'utf8' })

  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function detectPackages(changedFiles) {
  const selected = new Set()

  for (const file of changedFiles) {
    if (SHARED_TRIGGER_FILES.has(file)) {
      for (const pkg of PUBLISHABLE_PACKAGES) {
        selected.add(pkg.name)
      }
      continue
    }

    for (const pkg of PUBLISHABLE_PACKAGES) {
      if (file.startsWith(pkg.pathPrefix)) {
        selected.add(pkg.name)
      }
    }
  }

  return PUBLISHABLE_PACKAGES.filter((pkg) => selected.has(pkg.name)).map((pkg) => pkg.name)
}

function writeOutput(key, value) {
  const outputPath = process.env.GITHUB_OUTPUT
  if (!outputPath) {
    return
  }

  appendFileSync(outputPath, `${key}=${value}\n`)
}

const beforeSha = process.env.BEFORE_SHA ?? ''
const currentSha = process.env.CURRENT_SHA ?? 'HEAD'

let changedFiles = []
let packagesToBuild = []

try {
  changedFiles = readChangedFiles(beforeSha, currentSha)
  packagesToBuild = detectPackages(changedFiles)
} catch (error) {
  console.warn('[detect-build-filters] Failed to detect changes, falling back to building all publishable packages.')
  console.warn(error instanceof Error ? error.message : String(error))
  packagesToBuild = PUBLISHABLE_PACKAGES.map((pkg) => pkg.name)
}

const filters = packagesToBuild.map((name) => `--filter=${name}`).join(' ')
const hasFilters = packagesToBuild.length > 0 ? 'true' : 'false'

writeOutput('filters', filters)
writeOutput('has_filters', hasFilters)
writeOutput('packages', packagesToBuild.join(','))

console.log(`[detect-build-filters] changed files: ${changedFiles.length}`)
console.log(`[detect-build-filters] packages: ${packagesToBuild.join(', ') || '(none)'}`)
