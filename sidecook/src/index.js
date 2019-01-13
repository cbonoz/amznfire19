const Alexa = require('ask-sdk-core');

const ingredientsDocument = require('./APL/ingredients/document')
const handler = require('./handler')

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return true || handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    const speechText = 'Welcome to side cook, your personal cooking assistant.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        token: 'pagerToken',
        version: '1.0',
        document: ingredientsDocument,
        datasources: await handler.fetchIngredientsData()
      })
      .getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
