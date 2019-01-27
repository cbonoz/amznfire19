module.exports = (payload) => {
  const { appName, appTip, appWelcome } = payload

  const data = {
    backgroundSmall: "https://d2o906d8ln7ui1.cloudfront.net/images/LT1_Background.png",
    backgroundLarge: "https://d2o906d8ln7ui1.cloudfront.net/images/LT1_Background.png",
    "title": `Welcome to ${appName}!`,
    "logoUrl": "https://raw.githubusercontent.com/cbonoz/amznfire19/master/img/side_cook_white.png",
    
  }


  return {
    "type": "APL",
    "version": "1.0",
    "import": [
      {
        "name": "alexa-layouts",
        "version": "1.0.0"
      }
    ],
    "mainTemplate": {
      "parameters": [
        "payload"
      ],
      "items": [
        {
          "type": "Container",
          "width": "100vw",
          "height": "100vh",
          "borderWidth": 50,
          "direction": "column",
          "items": [
            {
              "type": "Image",
              "source": `${data.backgroundLarge}`,
              "scale": "best-fill",
              "width": "100vw",
              "height": "100vh",
              "position": "absolute"
            },
            {
              "type": "AlexaHeader",
              "headerTitle": `${data.title}`,
              "headerAttributionImage": `${data.logoUrl}`
            },
            {
              "type": "Container",
              "justifyContent": "center",
              "alignSelf": "center",
              "width": "90vw",
              "item": {
                "type": "Text",
                "width": "90vw",
                "textAlign": "center",
                "style": "textStylePrimary2",
                "text": appWelcome,
                "maxLines": 6
              }
            }
          ]
        }
      ]
    }
  }
}