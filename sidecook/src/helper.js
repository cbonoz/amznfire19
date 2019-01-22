const api = require('./helper/api') 
const transform = require('./helper/transformer') 
const ingredientsFn = require('./APL/ingredients')
const recipeSearchFn = require('./APL/RecipeSearch')

async function fetchIngredientsData(searchTerm) {
  const response = await api.searchRecipes(searchTerm)
  const res = transform({ data: response.data.meals[0], source: response.source })
  return ingredientsFn(res)
}

async function fetchRecipes(searchTerm) {
  const response = await api.searchRecipes(searchTerm)
  const meals = response.data.meals
  const transformedMeals = meals.map(meal => transform({ data: meal, source: response.source }))
  return transformedMeals
}

module.exports = {
  fetchIngredientsData,
  fetchRecipes
}