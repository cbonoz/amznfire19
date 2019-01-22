const api = require('./helper/api') 
const transform = require('./helper/transformer') 
const ingredientsFn = require('./APL/ingredients')
const recipeSearchFn = require('./APL/RecipeSearch')

function formatIngredientsData(ingredients, title) {
  const res = transform({ data: ingredients, source: response.source })
  res.title = title
  return ingredientsFn(res)
}

async function fetchRecipes(searchTerm) {
  const response = await api.searchRecipes(searchTerm)
  const meals = response.data.meals
  const transformedMeals = meals.map(meal => transform({ data: meal, source: response.source }))
  return transformedMeals
}

module.exports = {
  formatIngredientsData,
  fetchRecipes
}