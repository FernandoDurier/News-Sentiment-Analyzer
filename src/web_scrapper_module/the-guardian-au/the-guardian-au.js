const cheerio = require('cheerio');

exports.theGuardianAuScrapper = (html, url) => {
    return new Promise((resolve, reject) => {
        let text = "";
        if(html.length > 0) {
            let $ = cheerio.load(html);
            if($('.content__article-body') && $('.content__article-body').toArray().length > 0){
                $('.content__article-body').toArray().forEach(function(item) {
                    text += $(item).text() + " ";
                    text = text.trim();
                    text = text.replace(/undefined/g,' ');
                }); 
            }
        }
        resolve({
            "source_id": "The Guardian Au",
            "newsURL": url,
            "text": text,
            "html_page": html
        });
    });
}