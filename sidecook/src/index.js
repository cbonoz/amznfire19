const Alexa = require('ask-sdk-core')

const ingredientsDocument = require('./APL/ingredients/document.json')
const recipeSearchDocument = require('./APL/RecipeSearch/document.json')
const recipeStepsDocument = require('./APL/RecipeSteps/document.json')
const helloDocument = require('./APL/Hello/document.json')
const Fuse = require('fuse.js')

const helper = require('./helper')

const APP_NAME = 'Side Cook'

const ERROR_TEXT = `Sorry, I didn't understand the command. Try searching again!`
const WELCOME_TEXT = `Welcome to ${APP_NAME}, your personal cooking assistant. Let's find a recipe to make! For example, say 'sandwich recipes'.`

function supportsAPL(handlerInput) {
  const supportedInterfaces = handlerInput.requestEnvelope.context.System.device.supportedInterfaces;
  const aplInterface = supportedInterfaces['Alexa.Presentation.APL'];
  return aplInterface != null && aplInterface != undefined;
}

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
    const attributes = handlerInput.attributesManager.getSessionAttributes()

    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === "IngredientIntent"
      && attributes.currentRecipe
  },
  async handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes()

    const currentRecipe = attributes.currentRecipe
    if (!currentRecipe) {
      return CustomErrorHandler.handle(handlerInput, `No recipe selected yet! Search for a recipe first. Example: Cake recipes`)
    }

    const ingredients = currentRecipe.ingredients
    const recipeName = currentRecipe.name

    const ingredientString = ingredients.map(({name, measure}) => `${measure} ${name}`).join(', ')
    const speechText = `Here are the ingredients for ${recipeName}: ${ingredientString}. Would you like to hear those again or start the instructions?`

    if (!supportsAPL(handlerInput)) {
      return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse() 
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        version: '1.0',
        document: ingredientsDocument,
        datasources: helper.formatIngredientsData(ingredients)
      })
      .getResponse()
  }
}

const SearchRequestHandler = {
  canHandle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes()
    const bestRecipes = attributes.bestRecipes
    return !bestRecipes && 
      handlerInput.requestEnvelope.request.type === 'IntentRequest' && 
      handlerInput.requestEnvelope.request.intent.name === "SearchIntent"
  },
  async handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes()

    const slots = handlerInput.requestEnvelope.request.intent.slots
    const searchTerm = slots && slots.Food && slots.Food.value

    if (!searchTerm) {
      // We couldn't understand or find the search term in the query.
      return CustomErrorHandler.handle(handlerInput, `Sorry I didn't understand your selection. Try searching again!`);
    }

    const recipes = await helper.fetchRecipes(searchTerm)
    // console.log('recipes', recipes)
    // console.log('searchTerm', searchTerm)

    const bestRecipes = recipes.slice(0, Math.min(3, recipes.length))
    attributes.bestRecipes = bestRecipes

    const bestRecipeString = bestRecipes.map(recipe => recipe.name).join(', ')

    let speechText = ''
    if (bestRecipes.length > 1) {
      speechText = `Here are the best recipes we found for ${searchTerm}: ${bestRecipeString}`
    } else if (bestRecipes.length === 1) {
      speechText = `Here's the best recipe we found for ${searchTerm}: ${bestRecipeString}. Say select ${bestRecipeString} to begin.`
      attributes.currentRecipe = bestRecipes[0]
    } else { // 0 results
      return CustomErrorHandler.handle(handlerInput, `Sorry I didn't find any recipes for ${searchTerm}. Try searching again!`);
    }

    handlerInput.attributesManager.setSessionAttributes(attributes)

    if (!supportsAPL(handlerInput)) {
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse()
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        version: '1.0',
        document: recipeSearchDocument,
        datasources: {}
      })
      .getResponse()
  }
}

const SelectRecipeHandler = {
  canHandle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes()
    const bestRecipes = attributes.bestRecipes
    const currentRecipe = attributes.currentRecipe
    return bestRecipes && bestRecipes.length > 0 && !currentRecipe &&
      handlerInput.requestEnvelope.request.type === 'IntentRequest'
      // && handlerInput.requestEnvelope.request.intent.name === "SelectRecipeIntent"
  },
  async handle(handlerInput) {

    const attributes = handlerInput.attributesManager.getSessionAttributes()
    const bestRecipes = attributes.bestRecipes

    if (!bestRecipes) {
      return CustomErrorHandler.handle(handlerInput, `No recipes found yet! Search for a recipe first. Example: Cake recipes`)
    }

    const slots = handlerInput.requestEnvelope.request.intent.slots
    const recipeSearch = slots && slots.Recipe && slots.Recipe.value

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
    const currentRecipe = fuse.search(recipeSearch)[0]
    delete attributes.bestRecipes
    attributes.currentRecipe = currentRecipe
    attributes.instructionStep = 1
    attributes.ingredientStep = 1
    handlerInput.attributesManager.setSessionAttributes(attributes)

    
    const repromptText = "Say ingredient list, or say start the recipe. To cancel, say cancel."
    const speechText = `You selected ${currentRecipe.name}. ${repromptText}`

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      // .addDirective({
      //   type: 'Alexa.Presentation.APL.RenderDocument',
      //   token: 'pagerToken',
      //   version: '1.0',
      //   document: recipeStepsDocument,
      //   datasources: { currentRecipe, "instructionStep": 0 }
      // })
      .getResponse()
  }
}

const SelectStepHandler = {
  canHandle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes()
    const currentRecipe = attributes.currentRecipe
    return currentRecipe && handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === "SelectStepNumberIntent"
      || handlerInput.requestEnvelope.request.intent.name === "InstructionIntent")
  },
  async handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes()
    const currentRecipe = attributes.currentRecipe

    if (!currentRecipe) {
      return CustomErrorHandler.handle(handlerInput, `No recipe selected yet! Search for a recipe first. Example: Cake recipes`)
    }

    let step = 1 
    
    if (handlerInput.requestEnvelope.request.intent.name === "InstructionIntent") {
      step = attributes.instructionStep
    } else {
      const slots = handlerInput.requestEnvelope.request.intent.slots
      step = slots && slots.StepNumber && slots.StepNumber.value
        || slots && slots.StepNumberOrdinal && slots.StepNumberOrdinal.value
    }
    // convert step to number.
    step = +step

    if (step >= currentRecipe.instructions.length) {
      return CustomErrorHandler.handle(handlerInput, `Congratulations, You finished the meal! Ask me to search for another recipe!`)
    }

    if (step < 0) {
      return CustomErrorHandler.handle(handlerInput, `Sorry I didn't get your step number quite right. For example, say step 0.`)
    }

    const speechText = `Step ${step}: ${currentRecipe.instructions[step - 1]}`
    attributes.instructionStep = step
    handlerInput.attributesManager.setSessionAttributes(attributes)

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      // .addDirective({
      //   type: 'Alexa.Presentation.APL.RenderDocument',
      //   token: 'pagerToken',
      //   version: '1.0',
      //   document: recipeStepsDocument,
      //   datasources: { currentRecipe, instructionStep }
      // })
      .getResponse()

  }
}

const NextStepHandler = {
  canHandle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes()
    const currentRecipe = attributes.currentRecipe
    return currentRecipe && handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === "AMAZON.NextIntent" ||
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.MoreIntent")

  },
  async handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes()

    const currentRecipe = attributes.currentRecipe

    if (!currentRecipe) {
      return CustomErrorHandler.handle(handlerInput, `No recipe selected yet! Search for a recipe first. Example: Cake recipes`)
    }

    const step = attributes.instructionStep + 1
    if (step >= currentRecipe.instructions.length) {
      return CustomErrorHandler.handle(handlerInput, `Congratulations, You finished the meal! Ask me to search for another recipe!`)
    }

    const speechText = `Step ${step}: ${currentRecipe.instructions[step - 1]}`
    attributes.instructionStep = step
    handlerInput.attributesManager.setSessionAttributes(attributes)

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      // .addDirective({
      //   type: 'Alexa.Presentation.APL.RenderDocument',
      //   token: 'pagerToken',
      //   version: '1.0',
      //   document: recipeStepsDocument,
      //   datasources: { currentRecipe, instructionStep }
      // })
      .getResponse()
  }
}

const PrevStepHandler = {
  canHandle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes()
    const currentRecipe = attributes.currentRecipe
    return currentRecipe && handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === "AMAZON.PrevIntent"
  },
  async handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes()

    const currentRecipe = attributes.currentRecipe

    if (!currentRecipe) {
      return CustomErrorHandler.handle(handlerInput, `No recipe selected yet! Search for a recipe first. Example: Cake recipes`)
    }

    let step = attributes.instructionStep - 1
    if (step < 0) {
      step = 0
    }

    const speechText = `Step ${step + 1}: ${currentRecipe.instructions[step]}`
    attributes.instructionStep = step
    handlerInput.attributesManager.setSessionAttributes(attributes)

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      // .addDirective({
      //   type: 'Alexa.Presentation.APL.RenderDocument',
      //   token: 'pagerToken',
      //   version: '1.0',
      //   document: recipeStepsDocument,
      //   datasources: { currentRecipe, instructionStep }
      // })
      .getResponse()
  }
}


const StartOverHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === "AMAZON.StartOverIntent"
  },
  handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes()
    delete attributes.bestRecipes
    delete attributes.currentRecipe
    handlerInput.attributesManager.setSessionAttributes(attributes)
    return LaunchRequestHandler.handle(handlerInput)
  },
}

const ErrorHandler = {
  canHandle() {
    return true
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`)

    const attributes = handlerInput.attributesManager.getSessionAttributes()
    const currentRecipe = attributes.currentRecipe
    if (currentRecipe) {
      return CustomErrorHandler.handle(handlerInput, `Sorry I didn't get that. Try saying ingredient list, or a step number to resume making ${currentRecipe.name}. Or say start over`)
    }

    // Generic error
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
    PrevStepHandler,
    NextStepHandler,
    StartOverHandler,
    IngredientsRequestHandler
  )
  .addErrorHandlers(ErrorHandler, CustomErrorHandler)
  .lambda() // change this to .lambda() when uploaded