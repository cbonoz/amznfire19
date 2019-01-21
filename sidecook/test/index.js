const entry = require('../src/index')
const util = require('util')

const test = process.argv[2] || 'search'
const input = require('./' + test)


if (!input) {
  console.log('no test method specified')
  process.exit()
}

entry.handler.invoke(input)
  .then(response => {
    console.log(util.inspect(response, {showHidden: false, depth: null}))
  })




