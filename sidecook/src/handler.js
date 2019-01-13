const api = require('./helper/api') 
const transform = require('./helper/transformer') 
const ingredientsFn = require('./APL/ingredients')
const recipleSearchFn = require('./APL/RecipeSearch')

const fetchIngredientsData = () => {
  return api.searchRecipes('taco')
    .then(response => ({ data: response.data.meals[0], source: response.source }))
    .then(transform)
    .then(data => ingredientsFn(data.ingredients))
}

const fetchRecipes = (searchTerm = 'taco') => {
  return api.searchRecipes(searchTerm)
    .then(response => {
      let meals = response.data.meals

      return meals.map(meal => transform({ data: meal, source: response.source }))
    })
    .then(recipleSearchFn)
}

module.exports = {
  fetchIngredientsData,
  fetchRecipes
}