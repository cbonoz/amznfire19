<p align="center">
  <img src="img/side_cook_3_2.png" alt="SideCook" width="400">
</p>

# SideCook

SideCook is your own personal cooking assistant available on your FireTV.

## Inspiration

Too many of us watch Food Network on television, only to never actually make any of the recipes we watch.

There's a million cooking apps on the market today, but most of them are just recipe dictionaries, and don't interactively take you through the process of preparing the dish step by step. Rather they just throw a list of ingredients followed by all the steps in a single block.

We wanted to combine video and a more interactive/step-by-step process for cooking into a multimodal app. Simply find the recipe or food area you want to make, and we'll break it down into visual steps that you can follow along with on your television.

## What it does

1. Recommends the most popular/simple recipes based on the search criteria.
2. Automatically breaks down the recipe into a step by step formula that can easily be stepped through on a TV interface.
3. While you proceed through the recipe, we parse the descriptions for common cooking techniques - such as dicing, pureeing, filleting - and include videos that you can reference right then and there on the TV.

## How we built it

* FireTV
* Recipes.com 
* API

## Challenges we ran into

Integrating the Amazon APL library for voice. Learning how to use the HTML5 canvas for the TV interface.

## Accomplishments that we're proud of
It works.

## What we learned

How to decompose a structured API response into step by step screens onto a television. Parse through descriptions and render best practice videos.

## What's next for SideCook.

Put SideCook's model and UI under more strenuous user testing to figure out the most user friendly way to step through recipes on the television while you're actually cooking them.

## Amazon Resources
* https://developer.amazon.com/docs/fire-tv/getting-started-with-web-apps.html#using-web-app-tester-and-devtools 
* https://developer.amazon.com/docs/app-submission/submitting-apps-to-amazon-appstore.html

## Other Resources
* https://themealdb.com/
* https://developer.amazon.com/blogs/alexa/post/2af6851b-0216-4e82-9aba-6fa2aec755d5/how-to-get-started-with-the-new-alexa-presentation-language-to-build-multimodal-alexa-skills
* https://www.talkingtocomputers.com/apl-alexa-presentation-language
* https://github.com/amzn/web-app-starter-kit-for-fire-tv
* https://developer.edamam.com/
* https://www.themealdb.com/
