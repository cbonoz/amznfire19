module.exports = (payload) => {
    const { 
        recipeName, 
        recipeCategory, 
        recipeRegion, 
        stepNumber, 
        stepDescription, 
        stepCount, 
        stepHint 
    } = payload

    const stepImage = "https://d2o906d8ln7ui1.cloudfront.net/images/details_01.png"
    const backgroundImage = "https://d2o906d8ln7ui1.cloudfront.net/images/BT2_Background.png"
    const logoUrl = "https://raw.githubusercontent.com/cbonoz/amznfire19/master/img/side_cook_white.png"

    const recipeText = `You're making ${recipeName}`
    const categoryText = recipeRegion || recipeCategory

    return {

        document: {
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
                }
            },
            "layouts": {},
            "mainTemplate": {
                "parameters": [
                    "payload"
                ],
                "items": [
                    {
                        "when": "${viewport.shape == 'round'}",
                        "type": "Container",
                        "direction": "column",
                        "width": "100vw",
                        "height": "100vh",
                        "items": [
                            {
                                "type": "Image",
                                "source": backgroundImage,
                                "scale": "best-fill",
                                "width": "100vw",
                                "height": "100vh",
                                "position": "absolute",
                                "overlayColor": "rgba(0, 0, 0, 0.6)"
                            },
                            {
                                "type": "ScrollView",
                                "width": "100vw",
                                "height": "100vh",
                                "item": [
                                    {
                                        "type": "Container",
                                        "direction": "column",
                                        "alignItems": "center",
                                        "paddingLeft": "70dp",
                                        "paddingRight": "70dp",
                                        "items": [
                                            {
                                                "type": "AlexaHeader",
                                                "headerAttributionImage": logoUrl,
                                                "headerTitle": recipeText
                                            },
                                            {
                                                "type": "Text",
                                                "text": `<b>Step: ${stepNumber} of ${stepCount}</b>`,
                                                "style": "textStyleBody",
                                                "width": "70vw",
                                                "textAlign": "center"
                                            },
                                            {
                                                "type": "Text",
                                                "text": `Region: ${categoryText}`,
                                                "style": "textStylePrimary",
                                                "width": "70vw",
                                                "textAlign": "center"
                                            },
                                            {
                                                "type": "Text",
                                                "text": stepDescription,
                                                "paddingTop": 20,
                                                "style": "textStylePrimary",
                                                "width": "70vw",
                                                "textAlign": "center"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "Container",
                        "width": "100vw",
                        "height": "100vh",
                        "items": [
                            {
                                "type": "Image",
                                "source": backgroundImage,
                                "scale": "best-fill",
                                "width": "100vw",
                                "height": "100vh",
                                "position": "absolute"
                            },
                            {
                                "type": "AlexaHeader",
                                "headerTitle": recipeName,
                                "headerAttributionImage": logoUrl,
                            },
                            {
                                "type": "Container",
                                "direction": "row",
                                "paddingLeft": "60dp",
                                "paddingRight": "72dp",
                                "grow": 1,
                                "shrink": 1,
                                "height": "100vh",
                                "items": [
                                    {
                                        "type": "ScrollView",
                                        "height": "100%",
                                        "grow": 1,
                                        "shrink": 1,
                                        "item": [
                                            {
                                                "type": "Container",
                                                "items": [
                                                    // {
                                                    //     "type": "Text",
                                                    //     "text": `<b>${recipeCategory}</b>`,
                                                    //     "style": "textStylePrimary",
                                                    //     "color": "#4dd2ff"
                                                    // },
                                                    {
                                                        "type": "Text",
                                                        "text": `<b>Step: ${stepNumber} of ${stepCount}</b>`,
                                                        "style": "textStyleBody",
                                                        "color": "#4dd2ff"
                                                    },
                                                    {
                                                        "type": "Text",
                                                        "text": `Region: ${categoryText}`,
                                                        "style": "textStylePrimary"
                                                    },
                                                    {
                                                        "type": "Text",
                                                        "text": stepDescription,
                                                        "spacing": "@spacingSmall",
                                                        "paddingTop": "40dp",
                                                        "paddingRight": "70dp",
                                                        "style": "textStylePrimary"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Image",
                                        "source": stepImage,
                                        "width": 340,
                                        "height": 384,
                                        "scale": "best-fit",
                                        "align": "center"
                                    }
                                ]
                            },
                            {
                                "type": "AlexaFooter",
                                "footerHint": stepHint
                            }
                        ]
                    }
                ]
            }
        },
        "dataSources": {}
    }
}