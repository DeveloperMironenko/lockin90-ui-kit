// Publishes every package whose version isn't on npm yet. pnpm packs (that rewrites
// `workspace:*` dependencies to real versions); npm publishes the tarball, because
// npm, not pnpm, does npm Trusted Publishing (OIDC). Prints `New tag:` after each
// publish, which changesets/action turns into git tags and GitHub releases.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const dryRun = process.argv.includes('--dry-run')
// Provenance needs a CI identity (GitHub Actions OIDC); a local publish from a laptop has none.
const provenance = process.env.GITHUB_ACTIONS === 'true'
const { access } = JSON.parse(readFileSync('.changeset/config.json', 'utf8'))
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', ...opts })

// Only "not found" means unpublished; any other error (network, 5xx) stops the release.
function isPublished(name, version) {
  try {
    run('npm', ['view', `${name}@${version}`, 'version', '--json'], { stdio: ['ignore', 'pipe', 'pipe'] })
    return true
  } catch (error) {
    if (/E404|is not in this registry/.test(`${error.stdout}${error.stderr}`)) return false
    throw error
  }
}

const packages = readdirSync('packages', { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join('packages', entry.name, 'package.json')))
  .map((entry) => join('packages', entry.name))

const out = mkdtempSync(join(tmpdir(), 'lk-pack-'))
const failed = []
try {
  for (const cwd of packages) {
    const { name, version, private: isPrivate } = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'))
    if (isPrivate || isPublished(name, version)) continue

    const before = new Set(readdirSync(out))
    run('pnpm', ['pack', '--pack-destination', out], { cwd, stdio: 'ignore' })
    const tarball = join(out, readdirSync(out).find((file) => !before.has(file)))
    // A prerelease (1.2.0-next.0) goes out under its id (`next`), never as `latest`.
    const prerelease = version.split('-')[1]?.split('.')[0]
    const args = ['publish', tarball, '--access', access, '--loglevel', 'verbose']
    if (prerelease) args.push('--tag', prerelease)
    if (dryRun) args.push('--dry-run')
    else if (provenance) args.push('--provenance')
    try {
      run('npm', args, { stdio: 'inherit' })
      if (!dryRun) console.log(`New tag: ${name}@${version}`)
    } catch {
      failed.push(`${name}@${version}`)
    }
  }
} finally {
  rmSync(out, { recursive: true, force: true })
}

if (failed.length > 0) {
  console.error(`Failed to publish: ${failed.join(', ')}`)
  process.exit(1)
}
