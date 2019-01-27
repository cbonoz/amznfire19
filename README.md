<p align="center">
  <img src="img/side_cook_3_2.png" alt="SideCook" width="400">
</p>

# SideCook

SideCook is your personal cooking assistant in the kitchen powered from your Amazon Alexa.

## Inspiration

Too many of us watch Food Network on television, only to never actually make any of the recipes we watch.

There's a million cooking apps on the market today, but most of them are just recipe dictionaries, and don't interactively take you through the process of preparing the dish step by step. Rather they just throw a list of ingredients followed by all the steps in a single block.

We wanted to combine video and a more interactive/step-by-step process for cooking into a multimodal app. Simply find the recipe or food area you want to make, and we'll break it down into visual steps that you can follow along with on your television.

## What it does

1. Recommends the most popular/simple recipes based on the search criteria.
2. Automatically breaks down the recipe into a step by step formula that can easily be stepped through on a visual interface.
3. Render a list of ingredients for the recipe that can be accessed at any time while proceeding through the recipe.

## How we built it

* Alexa SDK
* APL (Alexa Presentation Language)
* TheMealDB API

## Challenges we ran into

Integrating the Amazon APL library for voice. Learning how to integrate state management into the app to allow the user to navigate between different recipes and steps.

## Accomplishments that we're proud of
It works.

## What we learned

How to decompose a structured API response into step by step screens onto a visual display. Parse through descriptions and render descriptions and images.

## What's next for SideCook.

Put SideCook's model and UI under more strenuous user testing to figure out the most user friendly way to step through recipes on the television while you're actually cooking them. Render additional content (such as videos) based on techniques being discussed in the current recipe step. For example, showing a video on proper dicing technique onto the display when the current step involves dicing.

## Amazon Resources
* https://developer.amazon.com/docs/fire-tv/getting-started-with-web-apps.html#using-web-app-tester-and-devtools 
* https://developer.amazon.com/docs/app-submission/submitting-apps-to-amazon-appstore.html

### Packaging
<pre>
  zip -r -X ../src.zip *
</pre>

### Testing
<pre>
  node test/index.js "filename"
</pre>
where filename is the json file input to execute on. The output will be the rendered response from the function.

## Other Resources
* https://themealdb.com/
* https://developer.amazon.com/blogs/alexa/post/2af6851b-0216-4e82-9aba-6fa2aec755d5/how-to-get-started-with-the-new-alexa-presentation-language-to-build-multimodal-alexa-skills
* https://www.talkingtocomputers.com/apl-alexa-presentation-language
* 
* https://www.themealdb.com/
