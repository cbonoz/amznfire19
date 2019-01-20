const transform = require('./helper/transformer') 
const buildIngredients = require('./APL/ingredients')
const api = require('./helper/api') 
const handler = require('./handler') 

const query = process.argv[2] || 'sandwich'

// node test searchTerm
handler.fetchRecipes(query)
  .then(data => {
    console.log(data)
  })

// test apl transform
// api.searchRecipes(query)
//   .then(response => ({ data: response.data.meals[0], source: response.source }))
//   .then(transform)
//   .then(data => buildIngredients(data.ingredients))
//   .then(data => {
//     console.log(data)
//   })
