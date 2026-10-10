import {
  formatHomepageFaqDryRun,
  refuseDatasetWrites,
} from './homepage-faqs.ts'

const refusal = refuseDatasetWrites(process.argv.slice(2))

if (refusal) {
  process.stderr.write(`${refusal}\n`)
  process.exitCode = 1
} else {
  process.stdout.write(formatHomepageFaqDryRun())
}
