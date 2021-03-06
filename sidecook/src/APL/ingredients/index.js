
const MetaData = require('./meta')

const buildIngredientsListData = data => {

  return data.map((ingredient, index) => ({
    "listItemIdentifier": ingredient.name,
    "ordinalNumber": index + 1,
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
    MetaData,
    IngredientList: {
      ...base,
      listPage: {
        listItems: buildIngredientsListData(data)
      }
    }
  }
}

module.exports = build