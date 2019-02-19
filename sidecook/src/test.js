const transform = require('./helper/transformer') 
const buildIngredients = require('./APL/ingredients')
const api = require('./helper/api') 
const helper = require('./helper') 

const query = process.argv[2] || 'fish'

// node test searchTerm
// helper.fetchRecipes(query)
//   .then(data => {
//     console.log(data)
//   })

// test apl transform
console.log('searching', query)
api.searchRecipes(query)
  .then(response => ({ data: response.data.meals[0], source: response.source }))
  .then(transform)
  .then(data => buildIngredients(data.ingredients))
  .then(data => {
    console.log(data)
  })
