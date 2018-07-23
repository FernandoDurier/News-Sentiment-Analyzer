const cheerio = require('cheerio');

exports.theVergeScrapper = (html, url) => {
    return new Promise((resolve, reject) => {
        let text = "";
        if( html.length > 0 ){
            if($('.c-entry-content') && $('.c-entry-content').toArray().length > 0){
                $('.c-entry-content').toArray().forEach(function(item) {
                    if(item){
                        var pretext = $(item).text() + " ";
                        text += pretext;
                        text = text.trim();
                        text = text.replace(/undefined/g,' ');
                    }
                }); 
            }
        }
        resolve({
            "source_id": "The Verge",
            "newsURL": url,
            "text": text,
            "html_page": html
        });
    });
}
