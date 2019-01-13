
const MetaData = require('./meta')

const buildIngredientsListData = data => {

  return data.map((recipe, index) => ({
    ordinalNumber: index + 1,
    "textContent": {
      "name": {
          "type": "PlainText",
          "text": recipe.name
      },
      "category": {
          "type": "PlainText",
          "text": recipe.category
      },
      "region": {
        "type": "PlainText",
        "text": recipe.region
    },
    }
  }))
}

const buildBase = data => ({
    "type": "list",
    "listId": "recipies",
    "totalNumberOfItems": data.length
})

const build = data => {
  const base = buildBase(data)

  return {
    MetaData,
    RecipeList: {
      ...base,
      data: buildIngredientsListData(data)
    }
  }
}

module.exports = build