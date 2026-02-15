import { readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

function fail(message) {
  console.error(`[validate-changeset-config] ${message}`)
  process.exit(1)
}

const configPath = path.resolve('.changeset/config.json')

let raw = ''
try {
  raw = readFileSync(configPath, 'utf8')
} catch (error) {
  fail(`Unable to read ${configPath}: ${error instanceof Error ? error.message : String(error)}`)
}

let config
try {
  config = JSON.parse(raw)
} catch (error) {
  fail(`Invalid JSON in ${configPath}: ${error instanceof Error ? error.message : String(error)}`)
}

const changelog = config.changelog
if (changelog === false) {
  fail(
    [
      '"changelog" cannot be false.',
      'changesets/action expects package CHANGELOG files when creating release PR/publish.',
      'Use: "changelog": "@changesets/cli/changelog"',
    ].join(' ')
  )
}

const validChangelog =
  typeof changelog === 'string'
    ? changelog.length > 0
    : Array.isArray(changelog)
      ? changelog.length > 0 && typeof changelog[0] === 'string'
      : false

if (!validChangelog) {
  fail(
    [
      '"changelog" is invalid.',
      'Expected a string or tuple style config (e.g. ["@changesets/cli/changelog", null]).',
    ].join(' ')
  )
}

const privatePackages = config.privatePackages
const isPrivatePackagesValid =
  privatePackages &&
  typeof privatePackages === 'object' &&
  privatePackages.version === false &&
  privatePackages.tag === false

if (!isPrivatePackagesValid) {
  fail(
    [
      '"privatePackages" must be set to:',
      '{"version": false, "tag": false}',
      'This prevents private workspace packages from being versioned/tagged.',
    ].join(' ')
  )
}

console.log('[validate-changeset-config] OK')
console.log(`[validate-changeset-config] changelog=${JSON.stringify(changelog)}`)
console.log(
  `[validate-changeset-config] privatePackages=${JSON.stringify({
    version: privatePackages.version,
    tag: privatePackages.tag,
  })}`
)
