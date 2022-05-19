"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_ENDPOINT_URL: '"https://pybossa-staging.citizenscience.ch/"',
  BASE_API_URL: '"https://pybossa-staging.citizenscience.ch/api/"',
  FLICKR_CALLBACK_URL: '"http://localhost:8080/flickr/callback"',
  GTAG_ID: '""',
  GOOGLE:'""'
});
