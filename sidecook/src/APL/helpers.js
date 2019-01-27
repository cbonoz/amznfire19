
const data = {
  backgroundSmall: "https://d2o906d8ln7ui1.cloudfront.net/images/LT1_Background.png",
  backgroundLarge: "https://d2o906d8ln7ui1.cloudfront.net/images/LT1_Background.png",
  "logoUrl": "https://raw.githubusercontent.com/cbonoz/amznfire19/master/img/side_cook_white.png",
  
}

exports.header = title => [{
    "type": "Image",
    "source": data.backgroundLarge,
    "scale": "best-fill",
    "width": "100vw",
    "height": "100vh",
    "position": "absolute"
},
{
    "type": "AlexaHeader",
    "headerTitle": title,
    "headerAttributionImage": data.logoUrl
}]

exports.footer = hint => ({
    "type": "AlexaFooter",
    "footerHint": hint
})

exports.base = () => ({
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
  }
})