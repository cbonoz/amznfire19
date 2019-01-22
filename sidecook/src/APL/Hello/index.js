module.exports = (payload) => {
  const {appName, appTip} = payload
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
          "type": "Text",
          "text": `Welcome to ${appName}: ${appTip}`
        },
      ]
    }
  }
}