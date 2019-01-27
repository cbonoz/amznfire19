const helper = require('../helpers')

module.exports = (payload) => {

    const { bestRecipes, searchTerm } = payload

    const data = {
        backgroundSmall: "https://d2o906d8ln7ui1.cloudfront.net/images/LT1_Background.png",
        backgroundLarge: "https://d2o906d8ln7ui1.cloudfront.net/images/LT1_Background.png",
        "logoUrl": "https://raw.githubusercontent.com/cbonoz/amznfire19/master/img/side_cook_white.png",
      }

    const recipeResultList = bestRecipes.map((recipe, i) => {
        return {
            "listItemIdentifier": recipe.name,
            "ordinalNumber": i+1,
            "textContent": {
                "primaryText": {
                    "type": "PlainText",
                    "text": recipe.name
                },
                "secondaryText": {
                    "type": "PlainText",
                    "text": "Origin: " + recipe.region
                }
            },
            "image": {
                "contentDescription": null,
                "smallSourceUrl": null,
                "largeSourceUrl": null,
                "sources": [
                    {
                        "url": recipe.thumb,
                        "size": "small",
                        "widthPixels": 0,
                        "heightPixels": 0
                    },
                    {
                        "url": recipe.thumb,
                        "size": "large",
                        "widthPixels": 0,
                        "heightPixels": 0
                    }
                ]
            },
            "token": `recipe-${i+1}`
        }
    })

    return {
        "type": 'Alexa.Presentation.APL.RenderDocument',
        "version": '1.0',
        "token": 'recipe-search-doc',
        "document": {
            ...helper.base(),
            "layouts": {
                "FullHorizontalListItem": {
                    "parameters": [
                        "listLength"
                    ],
                    "item": [
                        {
                            "type": "Container",
                            "height": "100vh",
                            "width": "100vw",
                            "alignItems": "center",
                            "justifyContent": "end",
                            "items": [
                                {
                                    "type": "Image",
                                    "position": "absolute",
                                    "height": "100vh",
                                    "width": "100vw",
                                    "overlayColor": "rgba(0, 0, 0, 0.6)",
                                    "source": "${data.image.sources[0].url}",
                                    "scale": "best-fill"
                                },
                                {
                                    "type": "AlexaHeader",
                                    "headerTitle": "${title}",
                                    "headerAttributionImage": "${logo}",
                                    "grow": 1
                                },
                                {
                                    "type": "Text",
                                    "text": "${data.textContent.primaryText.text}",
                                    "style": "textStyleBody",
                                    "maxLines": 1
                                },
                                {
                                    "type": "Text",
                                    "text": "${data.textContent.secondaryText.text}",
                                    "style": "textStyleDetails"
                                },
                                {
                                    "type": "Text",
                                    "text": "${ordinal} | ${listLength}",
                                    "paddingBottom": "20dp",
                                    "color": "white",
                                    "spacing": "5dp"
                                }
                            ]
                        }
                    ]
                },
                "HorizontalListItem": {
                    "item": [
                        {
                            "type": "Container",
                            "maxWidth": 528,
                            "minWidth": 312,
                            "paddingLeft": 16,
                            "paddingRight": 16,
                            "height": "100%",
                            "items": [
                                {
                                    "type": "Image",
                                    "source": "${data.image.sources[0].url}",
                                    "height": "50vh",
                                    "width": "50vh"
                                },
                                {
                                    "type": "Text",
                                    "text": "<b>${data.ordinalNumber}.</b>${data.textContent.primaryText.text}",
                                    "style": "textStyleSecondary",
                                    "maxLines": 1,
                                    "spacing": 12
                                },
                                {
                                    "type": "Text",
                                    "text": "${data.textContent.secondaryText.text}",
                                    "style": "textStyleDetails",
                                    "spacing": 4
                                }
                            ]
                        }
                    ]
                },
                "ListTemplate2": {
                    "items": [
                        {
                            "when": "${viewport.shape == 'round'}",
                            "type": "Container",
                            "height": "100%",
                            "width": "100%",
                            "items": [
                                {
                                    "type": "Sequence",
                                    "scrollDirection": "horizontal",
                                    "data": "${listData}",
                                    "height": "100%",
                                    "width": "100%",
                                    "numbered": true,
                                    "item": [
                                        {
                                            "type": "FullHorizontalListItem",
                                            "listLength": "${payload.listTemplate2ListData.listPage.listItems.length}"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "Container",
                            "height": "100vh",
                            "width": "100vw",
                            "items": [
                                ...helper.header(`Results for ${searchTerm}`),
                                {
                                    "type": "Sequence",
                                    "scrollDirection": "horizontal",
                                    "paddingLeft": "@marginLeft",
                                    "paddingRight": "@marginRight",
                                    "data": recipeResultList,
                                    "height": "70vh",
                                    "width": "100%",
                                    "numbered": true,
                                    "item": [
                                        {
                                            "type": "HorizontalListItem"
                                        }
                                    ]
                                },
                                helper.footer(`Try, "Alexa, select ${bestRecipes[0].name}"`)
                            ]
                        }
                    ]
                }
            },
            "mainTemplate": {
                "parameters": [
                    "payload"
                ],
                "item": [
                    {
                        "type": "ListTemplate2"
                    }
                ]
            }
        },
        "dataSources": {
        }
    }
}