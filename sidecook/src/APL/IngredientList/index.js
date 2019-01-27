const helper = require('../helpers')

module.exports = payload => {
  const { name, ingredients, category, region, thumb } = payload;

  // TODO: replace with payload parameters.
  return {
    type: 'Alexa.Presentation.APL.RenderDocument',
    token: 'recipe-ingredients-doc',
    version: '1.0',
    document: {
      ...helper.base(),
      layouts: {
        ListTemplate1: {
          parameters: [
            "backgroundImage",
            "title",
            "logo",
            "hintText",
            "listData"
          ],
          item: [
            {
              type: "Container",
              width: "100vw",
              height: "100vh",
              direction: "column",
              items: [
                ...helper.header('Ingredients for ' + name),
                {
                  type: "Sequence",
                  grow: 1,
                  height: "80vh",
                  scrollDirection: "vertical",
                  paddingLeft: "@marginLeft",
                  paddingRight: "@marginRight",
                  data: ingredients,
                  numbered: true,
                  items: [
                    {
                      type: "VerticalListItem"
                    }
                  ]
                }
              ]
            }
          ]
        },
        VerticalListItem: {
          item: [
            {
              when: "${viewport.shape == 'round'}",
              type: "Container",
              direction: "row",
              height: 200,
              width: "100%",
              separator: true,
              alignItems: "center",
              items: [
                {
                  type: "Text",
                  text: "${ordinal}",
                  paddingBottom: "20dp",
                  color: "white",
                  spacing: "5dp"
                },
                {
                  type: "Image",
                  when: "${image}",
                  source: "${image}",
                  height: 150,
                  width: 150,
                  spacing: 15,
                  scale: "best-fit",
                  align: "top"
                },
                {
                  type: "Container",
                  direction: "column",
                  spacing: 25,
                  items: [
                    {
                      type: "Text",
                      text: "${primaryText}",
                      style: "textStyleDetail",
                      grow: 1,
                      shrink: 1,
                      fontWeight: "300",
                      maxLines: 1
                    },
                    {
                      type: "Text",
                      text: "${secondaryText}",
                      style: "textStyleCaption",
                      fontWeight: "300",
                      grow: 1,
                      shrink: 1,
                      maxLines: 1
                    },
                    {
                      type: "Text",
                      text: "${tertiaryText}",
                      style: "textStyleDetails",
                      fontWeight: "300",
                      grow: 1,
                      shrink: 1,
                      maxLines: 1
                    }
                  ]
                }
              ]
            },
            {
              type: "Container",
              direction: "row",
              height: 125,
              width: "100%",
              alignItems: "center",
              separator: true,
              items: [
                {
                  type: "Text",
                  text: "${ordinal}",
                  color: "white",
                  spacing: "5dp"
                },
                {
                  type: "Container",
                  spacing: 30,
                  direction: "column",
                  items: [
                    {
                      type: "Text",
                      text: "${data.name}",
                      style: "textStyleBody",
                      fontWeight: "300",
                      grow: 1,
                      shrink: 1,
                      maxLines: 1
                    }
                  ]
                },
                {
                  type: "Text",
                  text: "${data.measure}",
                  style: "textStyleBody",
                  fontWeight: "300",
                  grow: 1,
                  shrink: 1,
                  textAlign: "right",
                  maxLines: 1
                }
              ]
            }
          ]
        }
      },
      mainTemplate: {
        parameters: ["payload"],
        item: [
          {
            type: "ListTemplate1"
          }
        ]
      }
    },
    dataSources: {
      listTemplate1ListData: {
        type: "list",
        listId: "lt1Sample",
        totalNumberOfItems: 10,
        listPage: {
          listItems: [
            {
              listItemIdentifier: "gouda",
              ordinalNumber: 1,
              textContent: {
                primaryText: {
                  type: "PlainText",
                  text: "Gouda"
                },
                secondaryText: {
                  type: "PlainText",
                  text: "Serving Size: 1oz (28g)"
                },
                tertiaryText: {
                  type: "PlainText",
                  text: "100 cal"
                }
              },
              image: {
                contentDescription: null,
                smallSourceUrl: null,
                largeSourceUrl: null,
                sources: [
                  {
                    url:
                      "https://d2o906d8ln7ui1.cloudfront.net/images/sm_gouda.png",
                    size: "small",
                    widthPixels: 0,
                    heightPixels: 0
                  },
                  {
                    url:
                      "https://d2o906d8ln7ui1.cloudfront.net/images/sm_gouda.png",
                    size: "large",
                    widthPixels: 0,
                    heightPixels: 0
                  }
                ]
              },
              token: "gouda"
            },
            {
              listItemIdentifier: "cheddar",
              ordinalNumber: 2,
              textContent: {
                primaryText: {
                  type: "PlainText",
                  text: "Sharp Cheddar"
                },
                secondaryText: {
                  type: "RichText",
                  text: "Serving Size: 1 slice (28g)"
                },
                tertiaryText: {
                  type: "PlainText",
                  text: "113 cal"
                }
              },
              image: {
                contentDescription: null,
                smallSourceUrl: null,
                largeSourceUrl: null,
                sources: [
                  {
                    url:
                      "https://d2o906d8ln7ui1.cloudfront.net/images/sm_cheddar.png",
                    size: "small",
                    widthPixels: 0,
                    heightPixels: 0
                  },
                  {
                    url:
                      "https://d2o906d8ln7ui1.cloudfront.net/images/sm_cheddar.png",
                    size: "large",
                    widthPixels: 0,
                    heightPixels: 0
                  }
                ]
              },
              token: "cheddar"
            },
            {
              listItemIdentifier: "blue",
              ordinalNumber: 3,
              textContent: {
                primaryText: {
                  type: "PlainText",
                  text: "Blue"
                },
                secondaryText: {
                  type: "RichText",
                  text: "Serving Size: 1c, crumbled (135g)"
                },
                tertiaryText: {
                  type: "PlainText",
                  text: "476 cal"
                }
              },
              image: {
                contentDescription: null,
                smallSourceUrl: null,
                largeSourceUrl: null,
                sources: [
                  {
                    url:
                      "https://d2o906d8ln7ui1.cloudfront.net/images/sm_blue.png",
                    size: "small",
                    widthPixels: 0,
                    heightPixels: 0
                  },
                  {
                    url:
                      "https://d2o906d8ln7ui1.cloudfront.net/images/sm_blue.png",
                    size: "large",
                    widthPixels: 0,
                    heightPixels: 0
                  }
                ]
              },
              token: "blue"
            },
            {
              listItemIdentifier: "brie",
              ordinalNumber: 4,
              textContent: {
                primaryText: {
                  type: "PlainText",
                  text: "Brie"
                },
                secondaryText: {
                  type: "RichText",
                  text: "Serving Size: 1oz (28g)"
                },
                tertiaryText: {
                  type: "PlainText",
                  text: "95 cal"
                }
              },
              image: {
                contentDescription: null,
                smallSourceUrl: null,
                largeSourceUrl: null,
                sources: [
                  {
                    url:
                      "https://d2o906d8ln7ui1.cloudfront.net/images/sm_brie.png",
                    size: "small",
                    widthPixels: 0,
                    heightPixels: 0
                  },
                  {
                    url:
                      "https://d2o906d8ln7ui1.cloudfront.net/images/sm_brie.png",
                    size: "large",
                    widthPixels: 0,
                    heightPixels: 0
                  }
                ]
              },
              token: "brie"
            },
            {
              listItemIdentifier: "cheddar",
              ordinalNumber: 5,
              textContent: {
                primaryText: {
                  type: "PlainText",
                  text: "Cheddar"
                },
                secondaryText: {
                  type: "RichText",
                  text: "Serving Size: 1oz (28g)"
                },
                tertiaryText: {
                  type: "PlainText",
                  text: "113 cal"
                }
              },
              image: {
                contentDescription: null,
                smallSourceUrl: null,
                largeSourceUrl: null,
                sources: [
                  {
                    url:
                      "https://d2o906d8ln7ui1.cloudfront.net/images/sm_cheddar.png",
                    size: "small",
                    widthPixels: 0,
                    heightPixels: 0
                  },
                  {
                    url:
                      "https://d2o906d8ln7ui1.cloudfront.net/images/sm_cheddar.png",
                    size: "large",
                    widthPixels: 0,
                    heightPixels: 0
                  }
                ]
              },
              token: "cheddar"
            },
            {
              listItemIdentifier: "parm",
              ordinalNumber: 6,
              textContent: {
                primaryText: {
                  type: "PlainText",
                  text: "Parm"
                },
                secondaryText: {
                  type: "RichText",
                  text: "Serving Size: 1oz (28g)"
                },
                tertiaryText: {
                  type: "PlainText",
                  text: "122 cal"
                }
              },
              image: {
                contentDescription: null,
                smallSourceUrl: null,
                largeSourceUrl: null,
                sources: [
                  {
                    url:
                      "https://d2o906d8ln7ui1.cloudfront.net/images/sm_parm.png",
                    size: "small",
                    widthPixels: 0,
                    heightPixels: 0
                  },
                  {
                    url:
                      "https://d2o906d8ln7ui1.cloudfront.net/images/sm_parm.png",
                    size: "large",
                    widthPixels: 0,
                    heightPixels: 0
                  }
                ]
              },
              token: "parm"
            }
          ]
        }
      }
    }
  };
};
