module.exports = payload => {
  const { name, ingredients, category, region, thumb } = payload;

  // TODO: replace with payload parameters.
  return {
    type: 'Alexa.Presentation.APL.RenderDocument',
    token: 'recipe-ingredients-doc',
    version: '1.0',
    document: {
      type: "APL",
      version: "1.0",
      theme: "dark",
      import: [
        {
          name: "alexa-layouts",
          version: "1.0.0"
        }
      ],
      resources: [
        {
          description: "Stock color for the light theme",
          colors: {
            colorTextPrimary: "#151920"
          }
        },
        {
          description: "Stock color for the dark theme",
          when: "${viewport.theme == 'dark'}",
          colors: {
            colorTextPrimary: "#f0f1ef"
          }
        },
        {
          description: "Standard font sizes",
          dimensions: {
            textSizeBody: 48,
            textSizePrimary: 27,
            textSizeSecondary: 23,
            textSizeDetails: 20,
            textSizeSecondaryHint: 25
          }
        },
        {
          description: "Common spacing values",
          dimensions: {
            spacingThin: 6,
            spacingSmall: 12,
            spacingMedium: 24,
            spacingLarge: 48,
            spacingExtraLarge: 72
          }
        },
        {
          description: "Common margins and padding",
          dimensions: {
            marginTop: 40,
            marginLeft: 60,
            marginRight: 60,
            marginBottom: 40
          }
        }
      ],
      styles: {
        textStyleBase: {
          description: "Base font description; set color and core font family",
          values: [
            {
              color: "@colorTextPrimary",
              fontFamily: "Amazon Ember"
            }
          ]
        },
        textStyleBase0: {
          description: "Thin version of basic font",
          extend: "textStyleBase",
          values: {
            fontWeight: "100"
          }
        },
        textStyleBase1: {
          description: "Light version of basic font",
          extend: "textStyleBase",
          values: {
            fontWeight: "300"
          }
        },
        textStyleBase2: {
          description: "Regular version of basic font",
          extend: "textStyleBase",
          values: {
            fontWeight: "500"
          }
        },
        mixinBody: {
          values: {
            fontSize: "@textSizeBody"
          }
        },
        mixinPrimary: {
          values: {
            fontSize: "@textSizePrimary"
          }
        },
        mixinDetails: {
          values: {
            fontSize: "@textSizeDetails"
          }
        },
        mixinSecondary: {
          values: {
            fontSize: "@textSizeSecondary"
          }
        },
        textStylePrimary: {
          extend: ["textStyleBase1", "mixinPrimary"]
        },
        textStyleSecondary: {
          extend: ["textStyleBase0", "mixinSecondary"]
        },
        textStyleBody: {
          extend: ["textStyleBase1", "mixinBody"]
        },
        textStyleSecondaryHint: {
          values: {
            fontFamily: "Bookerly",
            fontStyle: "italic",
            fontSize: "@textSizeSecondaryHint",
            color: "@colorTextPrimary"
          }
        },
        textStyleDetails: {
          extend: ["textStyleBase2", "mixinDetails"]
        }
      },
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
                {
                  type: "Image",
                  source: "${backgroundImage}",
                  scale: "best-fill",
                  width: "100vw",
                  height: "100vh",
                  position: "absolute"
                },
                {
                  type: "AlexaHeader",
                  headerTitle: "${title}",
                  headerAttributionImage: "${logo}"
                },
                {
                  type: "Sequence",
                  grow: 1,
                  height: "80vh",
                  scrollDirection: "vertical",
                  paddingLeft: "@marginLeft",
                  paddingRight: "@marginRight",
                  data: "${listData}",
                  numbered: true,
                  items: [
                    {
                      type: "VerticalListItem",
                      image: "${data.image.sources[0].url}",
                      primaryText: "${data.textContent.primaryText.text}",
                      secondaryText: "${data.textContent.secondaryText.text}",
                      tertiaryText: "${data.textContent.tertiaryText.text}"
                    }
                  ]
                }
              ]
            }
          ]
        },
        VerticalListItem: {
          parameters: ["primaryText", "secondaryText", "tertiaryText", "image"],
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
                  paddingBottom: "20dp",
                  color: "white",
                  spacing: "5dp"
                },
                {
                  type: "Image",
                  when: "${image}",
                  source: "${image}",
                  height: 100,
                  width: 100,
                  align: "top",
                  spacing: 50,
                  scale: "best-fit"
                },
                {
                  type: "Container",
                  spacing: 30,
                  direction: "column",
                  items: [
                    {
                      type: "Text",
                      text: "${primaryText}",
                      style: "textStyleBody",
                      fontWeight: "300",
                      grow: 1,
                      shrink: 1,
                      maxLines: 1
                    },
                    {
                      type: "Text",
                      text: "${secondaryText}",
                      style: "textStyleDetails",
                      fontWeight: "300",
                      grow: 1,
                      shrink: 1,
                      maxLines: 1
                    }
                  ]
                },
                {
                  type: "Text",
                  text: "${tertiaryText}",
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
            type: "ListTemplate1",
            backgroundImage:
              "${payload.listTemplate1Metadata.backgroundImage.sources[0].url}",
            title: "${payload.listTemplate1Metadata.title}",
            logo: "${payload.listTemplate1Metadata.logoUrl}",
            listData: "${payload.listTemplate1ListData.listPage.listItems}"
          }
        ]
      }
    },
    dataSources: {
      listTemplate1Metadata: {
        type: "object",
        objectId: "lt1Metadata",
        backgroundImage: {
          contentDescription: null,
          smallSourceUrl: null,
          largeSourceUrl: null,
          sources: [
            {
              url:
                "https://d2o906d8ln7ui1.cloudfront.net/images/LT1_Background.png",
              size: "small",
              widthPixels: 0,
              heightPixels: 0
            },
            {
              url:
                "https://d2o906d8ln7ui1.cloudfront.net/images/LT1_Background.png",
              size: "large",
              widthPixels: 0,
              heightPixels: 0
            }
          ]
        },
        title: "Calories in 1 Serving of Cheese",
        logoUrl:
          "https://d2o906d8ln7ui1.cloudfront.net/images/cheeseskillicon.png"
      },
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
