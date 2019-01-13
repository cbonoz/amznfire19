const api = require('./helper/api') 
const transform = require('./helper/transformer') 
const ingredientsFn = require('./APL/ingredients')

const fetchIngredientsData = () => {
  return api.searchRecipes('taco')
    .then(response => ({ data: response.data.meals[0], source: response.source }))
    .then(transform)
    .then(data => ingredientsFn(data.ingredients))
}

module.exports = {
  fetchIngredientsData
}