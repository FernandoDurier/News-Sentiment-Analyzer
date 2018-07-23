const countries         = require('country-data').countries,
    currencies          = require('country-data').currencies,
    regions             = require('country-data').regions,
    languages           = require('country-data').languages,
    callingCountries    = require('country-data').callingCountries;
const language_detector = require('../language_detector_module/detector.js').language_detector;

//Search Space
let countryMap = countries.all;
/**
 * The purpose of this function is to find what country(ies) are related to that text fragment
 * @param {*} text is a text fragment containing information about a country
 * @returns detectionJson = {"main_countries":<list of countries that are mentioned in the news body>,"related_by_language":<countries that would compreheend the news>}
 */
exports.detect_country = (text) => {
    let text_language = language_detector(text,"iso3")[0];
    let detectionJson = {
        "main_countries": [],
        "related_by_language": []
    };
    for(let country in countryMap) {
        if ( text.indexOf(countryMap[country].name ) > -1 
            || text.indexOf( ' '+countryMap[country].alpha3+' ' ) > -1
        ) {
            if ( detectionJson.main_countries.indexOf(countryMap[country]) < 0 ) {
                detectionJson.main_countries.push(countryMap[country].name);    
            }
        }
        if ( countryMap[country].languages.indexOf(text_language) > -1 ) {
            if( detectionJson.related_by_language.indexOf(countryMap[country]) < 0 ) {
                detectionJson.related_by_language.push(countryMap[country].name);
            }
        }
    }
    return detectionJson;
}