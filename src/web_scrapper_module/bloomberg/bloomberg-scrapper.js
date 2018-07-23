const cheerio = require('cheerio');

exports.bloombergScrapper = (html, url) => {
    return new Promise((resolve, reject) => {
        let text = "";
        if (html.length > 0) {
            let $ = cheerio.load(html);
            if($('.fence-body') && $('.fence-body').toArray().length > 0){
                $('.fence-body').toArray().forEach(function(item) {
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
            "source_id": "Bloomberg",
            "newsURL": url,
            "text": text,
            "html_page": html
        });
    });
}