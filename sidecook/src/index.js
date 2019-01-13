const Alexa = require('ask-sdk-core');

const ingredientsDocument = require('./APL/ingredients/document')
const recipeDocument = require('./APL/RecipeSearch/document')

const handler = require('./handler')

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    const speechText = 'Welcome to side cook, your personal cooking assistant. You can ask me to search for recipes.';

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

const IngredientsRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === "IngredientsIntent"
  },
  async handle(handlerInput) {
    const speechText = "Here are the ingredients for tacos"

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

const SearchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === "SearchIntent"
  },
  async handle(handlerInput) {
    const speechText = "Here are the recipes we found for tacos"

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        token: 'pagerToken',
        version: '1.0',
        document: ingredientsDocument,
        datasources: await handler.fetchRecipes()
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
    LaunchRequestHandler,
    SearchRequestHandler,
    IngredientsRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
