import { formatHomepageDryRun, refuseHomepageWrites } from './homepage.ts'

const refusal = refuseHomepageWrites(process.argv.slice(2))

if (refusal) {
  process.stderr.write(`${refusal}\n`)
  process.exitCode = 1
} else {
  process.stdout.write(formatHomepageDryRun())
}
