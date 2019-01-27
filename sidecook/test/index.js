const entry = require('../src/index')
const util = require('util')

const test = process.argv[2] || 'search'
const input = require('./' + test)


// for example, run `node index.js selectRecipe`

if (!input) {
  console.log('no test method specified')
  process.exit()
}

entry.tester.invoke(input)
  .then(response => {
    console.log(util.inspect(response, {showHidden: false, depth: null}))
  })




