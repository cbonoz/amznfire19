const Alexa = require('ask-sdk-core')

const ingredientsDocument = require('./APL/ingredients/document')
const recipeSearchDocument = require('./APL/RecipeSearch/document')
const recipeStepsDocument = require('./APL/RecipeSteps/document')
const Fuse = require('fuse.js')

const handler = require('./handler')

const APP_NAME = 'Side Cook'

const ERROR_TEXT = `Sorry, I didn't understand the command. Please try again.`
const WELCOME_TEXT = `Welcome to ${APP_NAME}, your personal cooking assistant. Let's find a recipe to make! For example, say 'sandwich recipes'.`

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  async handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(WELCOME_TEXT)
      .reprompt(WELCOME_TEXT)
      .getResponse()
  }
}

const IngredientsRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === "IngredientIntent"
  },
  async handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes()

    const currentRecipe = attributes.currentRecipe
    if (!currentRecipe) {
      return CustomErrorHandler.handle(handlerInput, `No recipe selected yet! Search for a recipe first. Example: Cake recipes`)
    }

    const ingredients = currentRecipe.ingredients
    const recipeName = currentRecipe.name

    const ingredientString = ingredients.join(', ')

    const speechText = `Here are the ingredients for ${recipeName}: ${ingredientString}`

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      // .addDirective({
      //   type: 'Alexa.Presentation.APL.RenderDocument',
      //   token: 'pagerToken',
      //   version: '1.0',
      //   document: ingredientsDocument,
      //   datasources: ingredients
      // })
      .getResponse()
  }
}

const SearchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === "SearchIntent"
  },
  async handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes()

    const slots = handlerInput.requestEnvelope.request.intent.slots
    const searchTerm = slots && slots.Food && slots.Food.value

    if (!searchTerm) {
      // We couldn't understand or find the search term in the query.
      return CustomErrorHandler.handle(handlerInput, `Sorry I didn't understand your selection. Please say it again`);
    }

    const recipes = await handler.fetchRecipes(searchTerm)
    // console.log('recipes', recipes)
    // console.log('searchTerm', searchTerm)

    const bestRecipes = recipes.slice(0, Math.min(3, recipes.length))
    attributes.bestRecipes = bestRecipes
    attributes.currentStep = 0
    handlerInput.attributesManager.setSessionAttributes(attributes)

    const bestRecipeString = bestRecipes.map(recipe => recipe.name).join(', ')

    let speechText = ''
    if (bestRecipes.length > 1) {
      speechText = `Here are the best recipes we found for ${searchTerm}: ${bestRecipeString}`
    } else {
      speechText = `Here's the best recipe we found for ${searchTerm}: ${bestRecipeString}`
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      // .addDirective({
      //   type: 'Alexa.Presentation.APL.RenderDocument',
      //   token: 'pagerToken',
      //   version: '1.0',
      //   document: recipeSearchDocument,
      //   datasources: recipes
      // })
      .getResponse()
  }
}

const SelectRecipeHandler = {
  canHandle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes()
    return attributes.bestRecipes && attributes.bestRecipes.length > 0 &&
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === "SelectRecipeIntent"
  },
  async handle(handlerInput) {

    const attributes = handlerInput.attributesManager.getSessionAttributes()
    const bestRecipes = attributes.bestRecipes

    if (!bestRecipes) {
      return CustomErrorHandler.handle(handlerInput, `No recipes found yet! Search for a recipe first. Example: Cake recipes`)
    }

    const slots = handlerInput.requestEnvelope.request.intent.slots
    const searchTerm = slots && slots.Recipe && slots.Recipe.value

    const searchOptions = {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        "name"
      ]
    }
    const fuse = new Fuse(bestRecipes, searchOptions)
    const currentRecipe = fuse.search(searchTerm)[0]
    delete attributes.bestRecipes
    attributes.currentRecipe = currentRecipe
    const currentStep = 0
    attributes.currentStep = currentStep
    handlerInput.attributesManager.setSessionAttributes(attributes)

    const repromptText = `${currentRecipe.instructions[currentStep]}.`
    const speechText = `You selected ${currentRecipe.name}. Let's start! ${repromptText}`

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      // .addDirective({
      //   type: 'Alexa.Presentation.APL.RenderDocument',
      //   token: 'pagerToken',
      //   version: '1.0',
      //   document: recipeStepsDocument,
      //   datasources: { currentRecipe, "currentStep": 0 }
      // })
      .getResponse()
  }
}

const SelectStepHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === "SelectStepIntent"
  },
  async handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes()
    const currentRecipe = attributes.currentRecipe

    if (!currentRecipe) {
      return CustomErrorHandler.handle(handlerInput, `No recipe selected yet! Search for a recipe first. Example: Cake recipes`)
    }

    const slots = handlerInput.requestEnvelope.request.intent.slots
    const currentStep = slots && slots.StepNumber && slots.StepNumber.value
    if (!currentStep || currentStep < 0 || currentStep >= currentRecipe.instructions.length) {
      return CustomErrorHandler.handle(handlerInput, `Congratulations, You finished the meal! Ask me to search for another recipe!`)
    }

    const speechText = currentRecipe.instructions[currentStep]
    attributes.currentStep = currentStep
    handlerInput.attributesManager.setSessionAttributes(attributes)

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      // .addDirective({
      //   type: 'Alexa.Presentation.APL.RenderDocument',
      //   token: 'pagerToken',
      //   version: '1.0',
      //   document: recipeStepsDocument,
      //   datasources: { currentRecipe, currentStep }
      // })
      .getResponse()

  }
}

const NextStepHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === "AMAZON.NextIntent"
  },
  async handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes()

    const currentRecipe = attributes.currentRecipe

    if (!currentRecipe) {
      return CustomErrorHandler.handle(handlerInput, `No recipe selected yet! Search for a recipe first. Example: Cake recipes`)
    }

    const currentStep = attributes.currentStep + 1
    if (currentStep >= currentRecipe.instructions.length) {
      return CustomErrorHandler.handle(handlerInput, `Congratulations, You finished the meal! Ask me to search for another recipe!`)
    }

    const speechText = currentRecipe.instructions[currentStep]
    attributes.currentStep = currentStep
    handlerInput.attributesManager.setSessionAttributes(attributes)

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      // .addDirective({
      //   type: 'Alexa.Presentation.APL.RenderDocument',
      //   token: 'pagerToken',
      //   version: '1.0',
      //   document: recipeStepsDocument,
      //   datasources: { currentRecipe, currentStep }
      // })
      .getResponse()
  }
}

const ErrorHandler = {
  canHandle() {
    return true
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`)

    return handlerInput.responseBuilder
      .speak(ERROR_TEXT)
      .reprompt(ERROR_TEXT)
      .getResponse()
  },
}

const CustomErrorHandler = {
  canHandle() {
    return true
  },
  handle(handlerInput, errorMessage) {
    const speechText = errorMessage
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse()
  },
}

const skillBuilder = Alexa.SkillBuilders.custom()

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    SearchRequestHandler,
    SelectStepHandler,
    SelectRecipeHandler,
    NextStepHandler,
    IngredientsRequestHandler
  )
  .addErrorHandlers(ErrorHandler, CustomErrorHandler)
  .create()
