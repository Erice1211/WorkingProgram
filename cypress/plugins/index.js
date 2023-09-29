// promisified fs module
const fs = require('fs-extra')
const path = require('path')

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('.', 'cypress', 'config', `cypress.${file}.json`)

  return fs.readJson(pathToConfigFile)
}

// plugins file
module.exports = async (on, config) => {
  require('cypress-mochawesome-reporter/plugin')(on);

  // accept a configFile value or use development by default
  const file = config.env.environment || 'ba'
  const loadedConfig = await getConfigurationByFile(file);
  const finalConfig = Object.assign({}, config, loadedConfig);

  return finalConfig;
}