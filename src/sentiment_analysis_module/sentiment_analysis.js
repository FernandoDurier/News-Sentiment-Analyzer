const Sentiment = require('sentiment');
const wink = require( 'wink-sentiment' );
const multilang = require('multilang-sentiment');
const sentiment_br = require('sentiment-ptbr');
const translate = require('google-translate-api');

const language_detector = require("./../language_detector_module/detector.js").language_detector;

let sentiment_analysis = (text) => {
    let detected_language = language_detector(text,"iso2");
    return new Sentiment(text,{"language":detected_language[0]});  
}

let wink_sentiment = (text) => {
    return wink(text);
}

let multilang_sentiment = (text) => {
    let detected_language = language_detector(text,"iso2");
    return multilang(text,detected_language[0]);
}

let sentiment_analysis_br = (text) => {
    return new sentiment_br(text);  
}

let sentiment_analysis_translated = (text) => {
    return new Promise((resolve, reject) => {
        let source_lang = language_detector(text,"iso2")[0];
        translate(text,{from: source_lang, to: 'en'})
        .then((tt)=>{
            resolve(new Sentiment(tt.text));
        })
        .catch((err)=>{
            console.log("Google Error: ", err);
            reject(err);
        });
    });
}

exports.analysis = function(text){
    let tobeanalysed = "";
    if(text && text.length > 0){
        tobeanalysed = text;
    }
    let from_sentiment = sentiment_analysis(tobeanalysed);
    let from_wink = wink_sentiment(tobeanalysed);
    let from_multilang = multilang_sentiment(tobeanalysed);
    let from_sentiment_br = sentiment_analysis_br(tobeanalysed);

    let finalJson = 
    {
        "from_sentiment_score":from_sentiment.score,
        "from_sentiment_comparative":from_sentiment.comparative,
        "from_sentiment_tokens":from_sentiment.tokens,
        "from_sentiment_words":from_sentiment.words,
        "from_sentiment_positive":from_sentiment.positive,
        "from_sentiment_negative":from_sentiment.negative,

        "from_wink_normalized_score":from_wink.normalizedScore,
        "from_wink_tokenize_phrase":from_wink.tokenizedPhrase,

        "from_multilang_score":from_multilang.score,
        "from_multilang_comparative":from_multilang.comparative,
        "from_multilang_tokens":from_multilang.tokens,
        "from_multilang_words":from_multilang.words,
        "from_multilang_positive":from_multilang.positive,
        "from_multilang_negative":from_multilang.negative,

        "from_sentiment_br_score":from_sentiment_br.score,
        "from_sentiment_br_comparative":from_sentiment_br.comparative,
        "from_sentiment_br_tokens":from_sentiment_br.tokens,
        "from_sentiment_br_words":from_sentiment_br.words,
        "from_sentiment_br_positive":from_sentiment_br.positive,
        "from_sentiment_br_negative":from_sentiment_br.negative        
    };

    return finalJson;
}

