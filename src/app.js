
const startScraping = require('./Calendar.js')

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('ERROR: No argument(s).')
  process.exit(0)
} else {
  startScraping(args)
}
