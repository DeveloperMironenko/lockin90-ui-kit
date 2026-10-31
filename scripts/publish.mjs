// Publishes every package whose version isn't on npm yet. pnpm packs (that rewrites
// `workspace:*` dependencies to real versions); npm publishes the tarball, because
// npm, not pnpm, does npm Trusted Publishing (OIDC). Prints `New tag:` lines for
// changesets/action, which tags the released versions.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readdirSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const dryRun = process.argv.includes('--dry-run')
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', ...opts })

const isPublished = (name, version) => {
  try {
    return run('npm', ['view', `${name}@${version}`, 'version'], { stdio: ['ignore', 'pipe', 'ignore'] }).trim() === version
  } catch {
    return false
  }
}

for (const dir of readdirSync('packages')) {
  const cwd = join('packages', dir)
  const { name, version, private: isPrivate } = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'))
  if (isPrivate || isPublished(name, version)) continue

  const out = mkdtempSync(join(tmpdir(), 'lk-pack-'))
  run('pnpm', ['pack', '--pack-destination', out], { cwd, stdio: 'ignore' })
  const tarball = join(out, readdirSync(out)[0])
  run('npm', ['publish', tarball, '--access', 'public', ...(dryRun ? ['--dry-run'] : ['--provenance'])], { stdio: 'inherit' })
  console.log(`New tag: ${name}@${version}`)
}
