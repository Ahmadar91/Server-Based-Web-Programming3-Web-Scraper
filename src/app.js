import { extractLinks } from './calendar.js'

const args = process.argv.slice(2)

if (args.length === 0) {
  console.error('ERROR: No argument(s).')
  process.exit(0)
} else {
  console.log(args)
  extractLinks(args)
}
