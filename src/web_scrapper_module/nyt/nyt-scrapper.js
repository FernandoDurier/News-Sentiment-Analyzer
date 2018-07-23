const cheerio = require('cheerio');

exports.nytScrapper = (html, url) => {
    return new Promise((resolve, reject) => {
        let text = "";
        if (html.length > 0) {
            let $ = cheerio.load(html);
            if($('.story-body-supplemental').toArray().length > 0){
                $('.story-body-supplemental').toArray().forEach(function(item) {
                    text = $(item).text();
                    text = text.trim();
                    text = text.replace(/undefined/g,' ');
                });
            }
            if($('.story').toArray().length > 0){
                $('.story').toArray().forEach(function(item) {
                    text = $(item).text();
                    text = text.trim();
                    text = text.replace(/undefined/g,' ');
                });
            }
        } 
        resolve({
            "source_id": "The New York Times",
            "newsURL": url,
            "text": text,
            "html_page": html
        });
    });
}