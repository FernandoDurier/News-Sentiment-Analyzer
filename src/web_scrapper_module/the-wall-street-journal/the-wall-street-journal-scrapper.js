const cheerio = require('cheerio');

exports.wallStreetJournalScrapper = (html, url) => {
    return new Promise((resolve, reject) => {
        let text = "";
        if(html.length > 0){
            let $ = cheerio.load(html);
            if($('.articleBody') && $('.articleBody').toArray().length > 0){
                $('.articleBody').toArray().forEach(function(item) {
                    if(item){
                        var pretext = $(item).text() + " ";
                        text += pretext;
                        text = text.trim();
                        text = text.replace(/undefined/g,' ');
                    }
                    else{
                        text += " ";
                    }
                }); 
            }
        }
        resolve({
            "source_id":"The Wall Street Journal",
            "newsURL":url,
            "text":text,
            "html_page": html
        });
    });
}