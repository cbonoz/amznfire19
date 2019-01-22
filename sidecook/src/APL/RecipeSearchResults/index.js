module.exports = (payload) => {

    const { bestRecipes, searchTerm } = payload

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
            "type": "APL",
            "version": "1.0",
            "theme": "dark",
            "import": [
                {
                    "name": "alexa-layouts",
                    "version": "1.0.0"
                }
            ],
            "resources": [
                {
                    "description": "Stock color for the light theme",
                    "colors": {
                        "colorTextPrimary": "#151920"
                    }
                },
                {
                    "description": "Stock color for the dark theme",
                    "when": "${viewport.theme == 'dark'}",
                    "colors": {
                        "colorTextPrimary": "#f0f1ef"
                    }
                },
                {
                    "description": "Standard font sizes",
                    "dimensions": {
                        "textSizeBody": 48,
                        "textSizePrimary": 27,
                        "textSizeSecondary": 23,
                        "textSizeDetails": 20,
                        "textSizeSecondaryHint": 25
                    }
                },
                {
                    "description": "Common spacing values",
                    "dimensions": {
                        "spacingThin": 6,
                        "spacingSmall": 12,
                        "spacingMedium": 24,
                        "spacingLarge": 48,
                        "spacingExtraLarge": 72
                    }
                },
                {
                    "description": "Common margins and padding",
                    "dimensions": {
                        "marginTop": 40,
                        "marginLeft": 60,
                        "marginRight": 60,
                        "marginBottom": 40
                    }
                }
            ],
            "styles": {
                "textStyleBase": {
                    "description": "Base font description; set color and core font family",
                    "values": [
                        {
                            "color": "@colorTextPrimary",
                            "fontFamily": "Amazon Ember"
                        }
                    ]
                },
                "textStyleBase0": {
                    "description": "Thin version of basic font",
                    "extend": "textStyleBase",
                    "values": {
                        "fontWeight": "100"
                    }
                },
                "textStyleBase1": {
                    "description": "Light version of basic font",
                    "extend": "textStyleBase",
                    "values": {
                        "fontWeight": "300"
                    }
                },
                "textStyleBase2": {
                    "description": "Regular version of basic font",
                    "extend": "textStyleBase",
                    "values": {
                        "fontWeight": "500"
                    }
                },
                "mixinBody": {
                    "values": {
                        "fontSize": "@textSizeBody"
                    }
                },
                "mixinPrimary": {
                    "values": {
                        "fontSize": "@textSizePrimary"
                    }
                },
                "mixinDetails": {
                    "values": {
                        "fontSize": "@textSizeDetails"
                    }
                },
                "mixinSecondary": {
                    "values": {
                        "fontSize": "@textSizeSecondary"
                    }
                },
                "textStylePrimary": {
                    "extend": [
                        "textStyleBase1",
                        "mixinPrimary"
                    ]
                },
                "textStyleSecondary": {
                    "extend": [
                        "textStyleBase0",
                        "mixinSecondary"
                    ]
                },
                "textStyleBody": {
                    "extend": [
                        "textStyleBase1",
                        "mixinBody"
                    ]
                },
                "textStyleSecondaryHint": {
                    "values": {
                        "fontFamily": "Bookerly",
                        "fontStyle": "italic",
                        "fontSize": "@textSizeSecondaryHint",
                        "color": "@colorTextPrimary"
                    }
                },
                "textStyleDetails": {
                    "extend": [
                        "textStyleBase2",
                        "mixinDetails"
                    ]
                }
            },
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
                                    "text": "<b>${ordinal}.</b> ${data.textContent.primaryText.text}",
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
                    "parameters": [
                        "backgroundImage",
                        "title",
                        "logo",
                        "hintText",
                        "listData"
                    ],
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
                                {
                                    "type": "Image",
                                    "source": "${backgroundImage}",
                                    "scale": "best-fill",
                                    "width": "100vw",
                                    "height": "100vh",
                                    "position": "absolute"
                                },
                                {
                                    "type": "AlexaHeader",
                                    "headerTitle": "${title}",
                                    "headerAttributionImage": "${logo}"
                                },
                                {
                                    "type": "Sequence",
                                    "scrollDirection": "horizontal",
                                    "paddingLeft": "@marginLeft",
                                    "paddingRight": "@marginRight",
                                    "data": "${listData}",
                                    "height": "70vh",
                                    "width": "100%",
                                    "numbered": true,
                                    "item": [
                                        {
                                            "type": "HorizontalListItem"
                                        }
                                    ]
                                },
                                {
                                    "type": "AlexaFooter",
                                    "footerHint": "${payload.listTemplate2ListData.hintText}"
                                }
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
                        "type": "ListTemplate2",
                        "backgroundImage": "${payload.listTemplate2Metadata.backgroundImage.sources[0].url}",
                        "title": "${payload.listTemplate2Metadata.title}",
                        "hintText": "${payload.listTemplate2Metadata.hintText}",
                        "logo": "${payload.listTemplate2Metadata.logoUrl}",
                        "listData": "${payload.listTemplate2ListData.listPage.listItems}"
                    }
                ]
            }
        },
        "dataSources": {
            "listTemplate2Metadata": {
                "type": "object",
                "objectId": "lt1Metadata",
                "backgroundImage": {
                    "contentDescription": null,
                    "smallSourceUrl": null,
                    "largeSourceUrl": null,
                    "sources": [
                        {
                            "url": "https://d2o906d8ln7ui1.cloudfront.net/images/LT2_Background.png",
                            "size": "small",
                            "widthPixels": 0,
                            "heightPixels": 0
                        },
                        {
                            "url": "https://d2o906d8ln7ui1.cloudfront.net/images/LT2_Background.png",
                            "size": "large",
                            "widthPixels": 0,
                            "heightPixels": 0
                        }
                    ]
                },
                "title": `Results for ${searchTerm}`,
                "logoUrl": "https://d2o906d8ln7ui1.cloudfront.net/images/cheeseskillicon.png"
            },
            "listTemplate2ListData": {
                "type": "list",
                "listId": "lt2Sample",
                "totalNumberOfItems": bestRecipes.length,
                "hintText": `Try, "Alexa, select ${bestRecipes[0].name}"`,
                "listPage": {
                    "listItems": recipeResultList
                }
            }
        }
    }
}