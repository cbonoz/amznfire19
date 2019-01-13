const api = require('./helper/api') 
const transform = require('./helper/transformer') 

api.searchRecipes('taco')

  .then(response => ({ data: response.data.meals[0], source: response.source }))
  .then(transform)
  .then(console.log)