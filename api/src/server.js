
/**
 * Add ESM as a module for our project. 
 * This will allow us to do some ES6 modules 
 * within our Node server. Nice!
 */
require = require("esm")(module);
module.exports = require("./app.js");