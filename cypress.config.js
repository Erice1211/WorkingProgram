// const { defineConfig } = require("cypress");

// module.exports = defineConfig({
//   e2e: {
//     setupNodeEvents(on, config) {
//       // implement node event listeners here
//     },
//   },
// });

const { defineConfig } = require("cypress");
const setupNodeEvents = require("./cypress/plugins/index.js");

module.exports = defineConfig({
  e2e: {
    reporter: "cypress-mochawesome-reporter",
    reporterOptions: {
      reportDir: "cypress/report",
      reportPageTitle: "Cypress Test Report",
      charts: true,
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
    },
    setupNodeEvents,
  },
  viewportWidth: 1200,
  viewportHeight: 660,
  retries:{
    // Configure retry attempts for `cypress run`
    // Default is 0
    runMode: 2,
    // Configure retry attempts for `cypress open`
    // Default is 0
    openMode: 2
  },

});


