const api = require('./helper/api') 
const transform = require('./helper/transformer') 

api.searchRecipes('taco')
  .then(data => data.meals[0])
  .then(recipe => transform({ source: 'themealdb', data: recipe}))
  .then(console.log)