#!/usr/bin/env node

var config = require("./config.js");


var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(config.apiKey, config.outputFormat);
var parameters;

parameters = {
  location:[-33.8670522, 151.1957362],
  types:"doctor"
};
googlePlaces.placeSearch(parameters, function (response) {
  console.log(response);
});
