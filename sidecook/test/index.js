const entry = require('../src/index')
const util = require('util')

const test = process.argv[2] || 'search'
const input = require('./' + test)


if (!input) {
  console.log('no test method specified')
  process.exit()
}

const output = entry.handler(input)
//console.log(util.inspect(output, {showHidden: false, depth: null}))
console.log(output)



