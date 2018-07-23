let cheerio = require('cheerio');

exports.cnnScrapper = (html, url) => {
    return new Promise((resolve, reject) => {
        let text = "";
        if ( html.length > 0 ) {
            let $ = cheerio.load(html);
            if($('.Article__content') && $('.Article__content').toArray().length > 0){
                $('.Article__content').toArray().forEach(function(item) {
                    text += $(item).text() + " ";
                    text = text.trim();
                    text = text.replace(/undefined/g,' ');
                }); 
            }
        }
        resolve({
            "source_id":"CNN News",
            "newsURL":url,
            "text":text,
            "html_page":html
        }); 
    });
}

