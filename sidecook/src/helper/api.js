const axios = require('axios')

const RECIPE_API_KEY = `1`
const RECIPE_BASE_URL = `https://www.themealdb.com/api/json/v1/${RECIPE_API_KEY}/search.php`

const random = (arr) => {
    return arr[Math.round(Math.random() * (arr.length - 1))]
}

function searchRecipes(queryString) {
    const url = `${RECIPE_BASE_URL}?s=${queryString}`
    return axios.get(url)
        .then(response => ({ data: response.data, source: 'themealdb'}))
}

module.exports = {
    searchRecipes,
    random
}
