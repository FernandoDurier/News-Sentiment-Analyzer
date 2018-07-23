var cheerio = require('cheerio');

exports.bbcScrapper = (html, url) => {
    return new Promise((resolve, reject) => {
        let text = "";
        if (html.length > 0) {
            let $ = cheerio.load(html);
            if ($('.story-body__inner') && $('.story-body__inner').toArray().length > 0){
                $('.story-body__inner').toArray().forEach(function(item) {
                    if ( item ) {
                        if ( item.children ) {
                            for ( var c = 0; c < item.children.length; c++ ) {
                                if ( item.children[c].name ) {
                                    if ( item.children[c].children.length > 0 ) {
                                        text += item.children[c].children[0].data + '\n';
                                    } else {
                                        text += item.children[c].data + '\n';
                                    }
                                    text = text.trim();
                                    text = text.replace(/undefined/g,' ');
                                }
                            }
                        } else {
                            text += $( item ).text();
                            text = text.trim();
                            text = text.replace(/undefined/g,' ');
                        }
                    }
                });
            }
        } 
        resolve({
            "source_id": "The BBC News",
            "newsURL": url,
            "text": text,
            "html_page": html
        });
    });
};