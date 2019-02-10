const api = require('./helper/api') 
const transform = require('./helper/transformer') 
const ingredientsFn = require('./APL/ingredients')
const recipeSearchFn = require('./APL/RecipeSearch')

const random = (arr) => {
  return arr[Math.round(Math.random() * (arr.length - 1))]
}

function formatIngredientsData(ingredients, title) {
  const res = transform({ data: ingredients, source: response.source })
  res.title = title
  return ingredientsFn(res)
}

async function fetchRecipes(searchTerm) {
  const response = await api.searchRecipes(searchTerm)
  const meals = response.data.meals
  const transformedMeals = meals.map(meal => transform({ data: meal, source: response.source }))
  return transformedMeals
}

const ALEXA_TIPS = [
  `Try, "Alexa, step 1"`,
  `Looking for another Recipe? Say, "Alexa start over"`,
  `Forgot the ingredients? Say, "Alexa list ingredients"`,
  `Try, "Alexa, continue" to go to the next step`,
  `Missed a step? Try "Alexa, go back"`
]

const COOKING_TIPS = [
`Set up the perfect workspace by gathering clean tools, bowls and utensils. And make sure to keep a trashcan within arm’s reach.`,
`To create an egg wash, whisk together a large egg with one tablespoon of water until smooth. Use as a glue to seal pastries, then brush on top for a glossy appearance.`,
`Peel tomatoes with ease! Cut an X in the top, and then simmer in a pot of hot water for 15 to 30 seconds. Cool down and the skin will fall right off.`,
`Get comfortable! Wear comfy clothes and an apron when you work in the kitchen and you won’t have to worry about getting dirty.`,
`Invest in a baking scale. Scales are not only an accurate way to measure your cooking ingredients, but they streamline the entire process.`,
`Always read and re-read your recipes before you start cooking.`,
`Clean as you go!`,
`Use two skewers instead of one when grilling or roasting to prevent your food from spinning.`,
`Learn and practice the rule of thumb to check the readiness of steak.`,
`To prevent butter from over-browning in your pan, add a little bit of lemon juice.`,
`Embrace salt. Don’t be afraid to use salt; it pulls the flavors out of your dishes. Cook with kosher salt and season with sea salt.`,
`No luck finding shallots? Replace with a combination of onions and garlic.`,
`After handling garlic, rub your fingers on stainless steel, like your sink, to get rid of the odor.`,
`Ovens can lie. Place a second thermometer in your oven to ensure proper preheating temperatures.`,
`Ignore cooking times. Check your dishes by using your own senses (smell, taste, touch) to decide when they are done.`,
`The most versatile and important tool is a sharp chef’s knife.`,
`Perfect all the different ways to cook an egg.`,
`When poaching an egg, add a teaspoon of white vinegar to simmering water to help keep the yolk from breaking.`,
`For a great hardboiled egg every time, bring your pot to a boil and then turn off the stove. Let your eggs sit in the heated pot for 12 minutes and then transfer to cold water.`,
`Crack eggs on a paper towel on the counter —no shells and easy cleanup!`,
`Make an ideal sunny-side egg by covering your pan with a lid and letting the steam cook your egg. No flipping required.`,
`Always taste your food before seasoning.`,
`Anchor your cutting board to the counter with a damp paper towel to keep things steady and safe.`,
`Hold a knife properly: pinch the blade instead of gripping the handle.`,
`Don’t rinse pasta.`,
`Substitute half a lemon and half an orange as a replacement for a Meyer lemon.`,
`When sautéing garlic, use sliced garlic instead of minced to prevent burning.`,
`Invest in a seasoned cast iron skillet. This kitchen staple distributes heat evenly and is easy to clean.`,
`Remove tough stems on leafy greens by pinching the stem and gently pulling off the leaves with your other hand.`,
`If your recipe calls for buttermilk, you can use regular milk with lemon juice.`,
`Prepping salad before serving is a huge time saver. Layer all the ingredients in a bowl and don’t add the dressing until it's time to serve.`,
`Keep your spices away from sources of heat like the stove or lights. Herbs and spices can lose their flavor when exposed to humidity and heat.`,
`Save old, stale bread to make breadcrumbs in a food processor; you can freeze them for up to 6 months.`,
`Let steaks come to room temperature before seasoning and grilling.`,
`Store fresh herbs in a glass of water in your refrigerator.`,
`To prevent tears, cut off the root of the onion before you slice.`,
`For crispy fries or chips: slice the potato, then remove the starch by soaking in water for one hour before baking.`,
`Celery getting floppy? Try wrapping it in tin foil before storing in the refrigerator.`,
`Soften up hard brown sugar by placing a piece of dry bread in the bag overnight.`,
`Roll citrus on the counter using the palm of your hand to help release all of the juice pockets.`,
`– 50. Kitchen Pantry Essentials: Olive Oil, Flour, Broth, Salt, Brown Rice or Pasta, Beans, Vinegar, Sugar, Eggs, Soy Sauce`,
`Increase the shelf life of a halved avocado by keeping the pit intact and placing it in your refrigerator.`,
`To prevent sliced apples from browning, lightly squeeze lemon or lime juice on the pieces.`,
`You can store butter in the freezer for up to six months.`,
`Honey is a natural preservative and will never spoil.`,
`To last longer, opened flour bags can be stored in the freezer.`,
`Mushrooms should be kept dry, as they can easily soak and store water.`,
`Never overcrowd your skillet with food. The heat will not distribute evenly.`,
`Use an egg slicer to cut small fruits like kiwis.`,
`Recipes are only a guideline. Feel free to substitute items that cater to your personal preferences.`,
`To rehydrate sun-dried tomatoes, soak them in hot water or stock for about 20 minutes.`,
`The basic ratio to make a classic vinaigrette is 3 parts oil to 1 part vinegar.`,
`To keep garlic from going rancid, always store it at room temperature.`,
`Keep knives sharp by using a sharpening tool frequently. A sharp knife is important for safety and efficiency.`,
`Purchasing and preparing a whole chicken is cost-effective and resourceful.`,
`Honey stuck in a jam? Place the container in hot water for about 5 minutes to loosen up the sticky residue.`,
`Safely chop odd-shaped vegetables by cutting off both ends for an even surface.`,
`Create simple syrup by simmering 1 cup of water and 1 cup of sugar in a medium heated pot until the sugar dissolves. Bottle and store in your refrigerator for up to 2 weeks.`,
`Freeze leftover tomato paste in small ice cube containers.`,
`To soften butter, cut slices into a bowl and let sit at room temperature for 10–15 minutes.`,
`When serving ice cream to large groups, ditch the ice cream scoop. Break open the whole container and slice the ice cream into portions.`,
`If you need to grate soft cheeses, freeze the cheese for 30 minutes for a cleaner slice.`,
`A cutting tool called a mandolin can be your best friend. They allow you to perfectly julienne, slice and dice vegetables every time. Always slice slowly and use the safety guard to prevent you from cutting your finger.`,
`When sautéing, it is important to first heat the pan, then heat the oil, then add the ingredients.`,
`Moisturize dried coconut by adding a sprinkle of milk and letting it sit for 10 minutes.`,
`Prevent bacteria growth by cooling hot food in a shallow dish.`,
`Make stock in large quantities and freeze in plastic bags for later use.`,
`Use Greek yogurt as a healthy substitute for mayo, sour cream, heavy cream and more.`,
`Before baking, remove butter and eggs from the fridge and let them reach room temperature.`,
`Invest in high-quality extra virgin olive oil for special meals or to drizzle over dishes to accent flavors.`,
`Let cooked or grilled meat rest at room temperature before serving.`,
`Plunge vegetables in ice water after blanching to help maintain a bright color.`,
`For easy clean-up, line baking sheets with parchment paper.`,
`Save money by purchasing in-season fruit and vegetables. You can freeze and store in airtight containers to save for later.`,
`Always taste your dishes before serving.`,
`Never over-season seafood; you want to still be able to taste the flavor of the fish. Simply use lemon juice, salt and pepper.`,
`Look for ground beef that has been freshly ground.`,
`Remember: to preserve flavor and prevent burning, it's important to always cook slow and keep your heat low.`,
`Always, always, always measure when baking. Baking is a science and any wrong measurements can be disastrous.`,
`Rice cookers can be your personal kitchen assistants. Let them do all the tedious work and you will never worry about monitoring and watching water boil.`,
`To make leafy greens last longer, wrap them in damp paper towels and place in a sealable plastic bag before storing.`,
`Test oil in a pan before adding all of your ingredients. Throw a small piece in and make sure it sizzles before adding the rest.`,
`When cooking with chili peppers, protect your hands and eyes by wearing rubber gloves. Or coat your hands in vegetable oil and wash them with soap and water immediately after handling.`,
`Homemade meals are good for the heart and soul. Cook often and cook with others.`,
`To prevent sogginess, do not dress salads for large parties. Serve, then allow guests to add their own dressing.`,
`Seafood should never smell overwhelmingly fishy; that's a sure sign that it’s starting to go bad.`,
`Chill cookie dough before putting it on a baking sheet. This will help prevent your butter from flattening and losing its fluffy texture.`,
`Remove seeds from chilies to help reduce heat.`,
`Keep key kitchen appliances, like a blender, on your countertop to encourage frequent use.`,
`Overcooked vegetables lose important enzymes and nutrients.`,
`Disinfect wood cutting boards by hand washing with vinegar.`
]

function getRandomCookingTip() {
  return random(COOKING_TIPS)
}
function getRandomAlexaTip() {
  return random(ALEXA_TIPS)
}
module.exports = {
  random,
  formatIngredientsData,
  fetchRecipes,
  getRandomAlexaTip,
  getRandomCookingTip
}