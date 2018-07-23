const cheerio = require('cheerio');

exports.lesEchosScrapper = (html, url) => {
    return new Promise((resolve, reject) => {
        let text = "";
        if( html.length > 0 ){
            let $ = cheerio.load(html);
            if($('.content-article') && $('.content-article').toArray().length > 0){
                $('.content-article').toArray().forEach(function(item) {
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
            "source_id": "Les Echos",
            "newsURL": url,
            "text": text,
            "html_page": html
        });
    });
}