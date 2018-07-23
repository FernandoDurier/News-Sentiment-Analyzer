const cheerio = require('cheerio');

exports.telegraphScrapper = (html, url) => {
    return new Promise((resolve, reject) => {
        let text = "";
        if(html.length > 0){
            let $ = cheerio.load(html);
            if($('article') && $('article').toArray().length > 0){
                $('article').toArray().forEach(function(item) {
                    if(item){
                        text += $(item).text() + " ";
                        text = text.trim();
                        text = text.replace(/undefined/g,' ');
                    }
                }); 
            }
        }
        resolve({
            "source_id": "The Telegraph",
            "newsURL": url,
            "text": text,
            "html_page": html
        });
    });
}