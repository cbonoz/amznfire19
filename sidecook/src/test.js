const api = require('./helper/api') 
const transform = require('./helper/transformer') 
const buildIngredients = require('./APLTranform/ingredients')

// node test searchTerm
// api.searchRecipes(process.argv[2])
//   .then(response => ({ data: response.data.meals[0], source: response.source }))
//   .then(transform)
//   .then(console.log)

// test apl transform
api.searchRecipes(process.argv[2])
  .then(response => ({ data: response.data.meals[0], source: response.source }))
  .then(transform)
  .then(data => buildIngredients(data.ingredients))
  .then(data => console.log(JSON.stringify(data)))
