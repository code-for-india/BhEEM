#!/usr/bin/env node

var config = require("./config.js");

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(config.apiKey, config.outputFormat);
var parameters;

function get(geoPrama,cb) {
  googlePlaces.placeSearch(geoPrama, function (response) {
    cb(response);
  });
}


module.exports = {get:get};