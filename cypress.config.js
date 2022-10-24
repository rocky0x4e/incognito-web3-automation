const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'ukvwmg',
  defaultCommandTimeout: 120000,
  execTimeout : 3600000,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
