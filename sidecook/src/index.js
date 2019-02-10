const Alexa = require('ask-sdk-core')

const ingredientsDocument = require('./APL/ingredients/document.json')
const recipeSearchDocument = require('./APL/RecipeSearch/document.json')
const recipeStepsDocument = require('./APL/RecipeSteps/document.json')
const renderHelloDocument = require('./APL/Hello')
const renderIngredientDocument = require('./APL/IngredientList')
const renderStepDocument = require('./APL/RecipeStep')
const renderSearchDocument = require('./APL/RecipeSearchResults')
const renderWelcomeDocument = require('./APL/Welcome')
const renderSampleDocument = require('./APL/Sample')
const Fuse = require('fuse.js')

const helper = require('./helper')

const APP_NAME = 'Side Cook'

const ERROR_TEXT = `Sorry, I didn't understand the command. Try asking for a recipe, or say "start over".`
const WELCOME_TEXT = `Welcome to ${APP_NAME}, your personal cooking assistant. Let's find a recipe to make! For example, say "Find Sandwich recipes".`
const STEP_TEXT = `Sorry I didn't get your step number quite right. For example, say "step 1", or say "next" or "back" to change steps.`
const FINISHED_TEXT = `Congratulations, You finished the meal! Ask me to search for another recipe, or say "start over"!`
const NO_RECIPE_TEXT = `No recipe selected yet! Search for a recipe first. Example, say "Find Cake recipes"`
const STOP_TEXT = `Let's cook again soon! Goodbye.`
const HELP_TEXT_DEFAULT = `Help: I am ${APP_NAME}, your personal cooking assistant. Let's find a recipe to make! For example, say "Find Sandwich recipes".`

function supportsAPL(handlerInput) {
  const supportedInterfaces = handlerInput.requestEnvelope.context.System.device.supportedInterfaces
  const aplInterface = supportedInterfaces['Alexa.Presentation.APL']
  return aplInterface != null && aplInterface != undefined
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  async handle(handlerInput) {

    const speechText = WELCOME_TEXT

    if (!supportsAPL(handlerInput)) {
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse()
    }
    const welcomeBody = {
      appName: APP_NAME,
      appWelcome: WELCOME_TEXT,
      appTip: "" // helper.getRandomAlexaTip()
    }
    // const welcomeDirective = renderWelcomeDocument()
    // console.log('welcomeDirective', JSON.stringify(welcomeDirective))
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .addDirective({
        "type": 'Alexa.Presentation.APL.RenderDocument',
        "version": '1.0',
        "token": "welcome-doc",
        "document": renderHelloDocument(welcomeBody)
      })
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

    const ingredientString = ingredients.map(({ name, measure }) => `${measure} ${name}`).join(', ')
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
      .addDirective(renderIngredientDocument(currentRecipe))
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
      return CustomErrorHandler.handle(handlerInput, `Sorry I didn't understand your selection. Try searching again!`)
    }

    const recipes = await helper.fetchRecipes(searchTerm)
    // console.log('recipes', recipes)
    // console.log('searchTerm', searchTerm)

    if (!recipes || recipes.length == 0) {
      return CustomErrorHandler.handle(handlerInput, `Sorry I didn't find any results for ${searchTerm}. Try searching again!`)
    }

    const bestRecipes = recipes.slice(0, Math.min(3, recipes.length))
    attributes.bestRecipes = bestRecipes

    const bestRecipeString = bestRecipes.map(recipe => recipe.name).join(', ')

    let speechText = ''
    if (bestRecipes.length > 1) {
      speechText = `Here are the best recipes we found for ${searchTerm}: ${bestRecipeString}`
    } else if (bestRecipes.length === 1) {
      speechText = `Here's the best recipe we found for ${searchTerm}: ${bestRecipeString}. Say 'start cooking' to begin, or say 'start over' to find another recipe. `
      attributes.currentRecipe = bestRecipes[0]
    } else { // 0 results
      return CustomErrorHandler.handle(handlerInput, `Sorry I didn't find any recipes for ${searchTerm}. Try searching again!`)
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
      .addDirective(renderSearchDocument({ searchTerm, bestRecipes }))
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
      return CustomErrorHandler.handle(handlerInput, NO_RECIPE_TEXT)
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

function renderStep(handlerInput, step, currentRecipe) {
  const stepDescription = currentRecipe.instructions[step - 1]
  const speechText = `Step ${step}: ${stepDescription}. Say 'next' to continue.`
  const stepBody = {
    recipeName: currentRecipe.name,
    recipeCategory: currentRecipe.recipeCategory,
    recipeRegion: currentRecipe.region,
    stepNumber: step,
    stepCount: currentRecipe.instructions.length,
    stepHint: helper.getRandomAlexaTip(),
    stepDescription
  }

  return handlerInput.responseBuilder
    .speak(speechText)
    .reprompt(speechText)
    .addDirective({
      type: 'Alexa.Presentation.APL.RenderDocument',
      token: 'recipe-step-doc',
      version: '1.0',
      ...renderStepDocument(stepBody)
    })
    .getResponse()
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
      return CustomErrorHandler.handle(handlerInput, NO_RECIPE_TEXT)
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
    step = parseInt(step)

    if (step > currentRecipe.instructions.length) {
      // TODO: replace with custom handler with finished APL document.
      return CustomErrorHandler.handle(handlerInput, FINISHED_TEXT) 
    }

    if (step < 1 || isNaN(step)) {
      return CustomErrorHandler.handle(handlerInput, STEP_TEXT)
    }

    attributes.instructionStep = step
    handlerInput.attributesManager.setSessionAttributes(attributes)

    if (!supportsAPL(handlerInput)) {
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse()
    }

    return renderStep(handlerInput, step, currentRecipe)
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
      return CustomErrorHandler.handle(handlerInput, NO_RECIPE_TEXT)
    }

    const step = parseInt(attributes.instructionStep) + 1
    if (isNaN(step)) {
      return CustomErrorHandler.handle(handlerInput, STEP_TEXT)
    }

    if (step > currentRecipe.instructions.length) {
      return CustomErrorHandler.handle(handlerInput, FINISHED_TEXT)
    }

    attributes.instructionStep = step
    handlerInput.attributesManager.setSessionAttributes(attributes)

    if (!supportsAPL(handlerInput)) {
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse()
    }

    return renderStep(handlerInput, step, currentRecipe)
  }
}

const PrevStepHandler = {
  canHandle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes()
    const currentRecipe = attributes.currentRecipe
    return currentRecipe && handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === "AMAZON.PreviousIntent" || handlerInput.requestEnvelope.request.intent.name === "AMAZON.PrevIntent")
  },
  async handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes()

    const currentRecipe = attributes.currentRecipe

    if (!currentRecipe) {
      return CustomErrorHandler.handle(handlerInput, NO_RECIPE_TEXT)
    }
    const step = parseInt(attributes.instructionStep) - 1
    if (isNaN(step)) {
      return CustomErrorHandler.handle(handlerInput, `Sorry I didn't get your step number quite right. For example, say step 1.`)
    }

    if (step < 1) {
      step = 1
    }

    attributes.instructionStep = step
    handlerInput.attributesManager.setSessionAttributes(attributes)

    if (!supportsAPL(handlerInput)) {
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse()
    }

    return renderStep(handlerInput, step, currentRecipe)
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

const ExitHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent')
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()

    return handlerInput.responseBuilder
      .speak(STOP_TEXT)
      .getResponse()
  },
}

const HelpHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
  },
  handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getRequestAttributes()
    const currentRecipe = attributes.currentRecipe
    let speechText
    if (currentRecipe) {
      speechText = `You currently in the recipe for ${currentRecipe.name}. Try saying ingredient list, or a step number to resume cooking like step 2. Or say start over. `
    } else {
      speechText = HELP_TEXT_DEFAULT
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse()
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
      return CustomErrorHandler.handle(handlerInput, `Sorry I didn't get that. Try saying ingredient list, or a step number to resume making ${currentRecipe.name}. Or say start over. `)
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

const baseSkill = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    SearchRequestHandler,
    SelectStepHandler,
    SelectRecipeHandler,
    PrevStepHandler,
    NextStepHandler,
    HelpHandler,
    ExitHandler,
    IngredientsRequestHandler,
    StartOverHandler
  )
  .addErrorHandlers(ErrorHandler, CustomErrorHandler)

exports.handler = baseSkill.lambda()
exports.tester = baseSkill.create()
