require("joi-i18n")
const joi = require("joi");

const fa = require("./fa");
joi.addLocaleData("fa", fa);
joi.setDefaultLocale("fa");
module.exports = joi;