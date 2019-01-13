const MetaData = require('./APLMetaData')

const build = transformer => data => ({
  MetaData,
  ...(transformer(data))
})

module.exports = build