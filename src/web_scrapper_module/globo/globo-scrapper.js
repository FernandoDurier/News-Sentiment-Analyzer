const cheerio = require('cheerio');

exports.globoScrapper = (html, url) => {
    return new Promise((resolve, reject) => {
        let text = "";
        if(html.length > 0){
            let $ = cheerio.load(html);
            if($('.story') && $('.story').toArray().length > 0){
                $('.story').toArray().forEach(function(item) {
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
            "source_id": "O Globo",
            "newsURL": url,
            "text": text,
            "html_page": html
        });
    });
}
