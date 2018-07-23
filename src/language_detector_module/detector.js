/**
 * vac is a npm module created after the hindu god of communication, it detects the language of a given text
 */
const vac = require('vac');
/**
 * 
 * @param {String} text is a textual fragment to be analysed in order to uncover its language 
 */
exports.language_detector = function(text,iso){
    /**
     * The vac.detect returns a json with languages as keys 
     * and for each a probability of the given input to belong to that language. 
     * This list of possibilities is order by 
     * the most likelihood of belonging to that language
     */
    let isotype="default";
    if(iso){isotype=iso}
    vac.languageType = isotype;
    let analysis = vac.detect(text);
    /**
     * Here we put the languages detected inside an array
     */
    let found_languages = Object.keys(analysis);
    /**
     * In order to not get a polluted result, we return the top 3 most likely to be the language 
     * discovered by the module.
     */
    return found_languages.slice(0,3);
}
