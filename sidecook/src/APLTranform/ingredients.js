
const WithMetaData = require('./WithMetaData')

const buildIngredientsListData = data => {

  return data.map((ingredient, index) => ({
    ordinalNumber: index + 1,
    "textContent": {
      "primaryText": {
          "type": "PlainText",
          "text": ingredient.name
      },
      "secondaryText": {
          "type": "PlainText",
          "text": ingredient.measure
      }
    }
  }))
}

const buildBase = data => ({
    "type": "list",
    "listId": "ingredients",
    "totalNumberOfItems": data.length
})

const build = data => {
  const base = buildBase(data)

  return {
    IngredientList: {
      ...base,
      data: buildIngredientsListData(data)
    }
  }
}

module.exports = WithMetaData(build)