module.exports = (payload) => {
  const {appName, appTip} = payload

  const data = {
    backgroundSmall: "https://d2o906d8ln7ui1.cloudfront.net/images/LT1_Background.png",
    backgroundLarge: "https://d2o906d8ln7ui1.cloudfront.net/images/LT1_Background.png",
    "title": "Welcome to SideCook!",
    "logoUrl": "https://raw.githubusercontent.com/cbonoz/amznfire19/master/img/side_cook_white.png"
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
            }
          ]
        }
      ]
    }
  }
}