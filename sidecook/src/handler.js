const api = require('./helper/api') 
const transform = require('./helper/transformer') 
const ingredientsFn = require('./APL/ingredients')
const recipeSearchFn = require('./APL/RecipeSearch')

const fetchIngredientsData = () => {
  return api.searchRecipes('taco')
    .then(response => ({ data: response.data.meals[0], source: response.source }))
    .then(transform)
    .then(data => ingredientsFn(data.ingredients))
}

const fetchRecipes = (searchTerm) => {
  return api.searchRecipes(searchTerm)
    .then(response => {
      const meals = response.data.meals
      const transformedMeals = meals.map(meal => transform({ data: meal, source: response.source }))
      return transformedMeals
    })
    // .then(recipeSearchFn)
}

module.exports = {
  fetchIngredientsData,
  fetchRecipes
}