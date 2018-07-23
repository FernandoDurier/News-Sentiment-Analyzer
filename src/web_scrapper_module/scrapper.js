var request = require('request');

const bbc = require('./bbc-news/bbc-news-scrapper');
const bloomberg = require('./bloomberg/bloomberg-scrapper');
const cnn = require('./cnn/cnn-scrapper');
const globo = require('./globo/globo-scrapper');
const lesEchos = require('./les-echos/les-echos-scrapper');
const newsComAu = require('./news-com-au/news-com-au-scrapper');
const nyt = require('./nyt/nyt-scrapper');
const theGuardianAu = require('./the-guardian-au/the-guardian-au');
const theTelegraph = require('./the-telegraph/the-telegraph-scrapper');
const theVerge = require('./the-verge/the-verge-scrapper');
const theWallStreetJournal = require('./the-wall-street-journal/the-wall-street-journal-scrapper');

let scrapperSelector = (source, html, url) => {
    return new Promise((resolve, reject) => {
        if(source == "nyt" || source == "The New York Times"){
            nyt.nytScrapper(html,url).then((d) => {resolve(d);});                   
        } else if(source == "bbc-news"){
            bbc.bbcScrapper(html,url).then((d)=>{resolve(d);});
        } else if(source == "the-guardian-au"){
            theGuardianAu.theGuardianAuScrapper(html,url).then((d)=>{resolve(d);});
        } else if(source == "cnn"){
            cnn.cnnScrapper(html,url).then((d)=>{resolve(d);});
        } else if(source == "the-telegraph"){
            theTelegraph.telegraphScrapper(html,url).then((d)=>{resolve(d);});
        } else if(source == "the-wall-street-journal"){
            theWallStreetJournal.wallStreetJournalScrapper(html,url).then((d)=>{resolve(d);});
        } else if(source == "the-verge"){
            theVerge.theVergeScrapper(html,url).then((d)=>{resolve(d);});
        } else if(source == "news-com-au"){
            newsComAu.newsComAUScrapper(html,url).then((d)=>{resolve(d);});
        } else if(source == "globo"){
            globo.globoScrapper(html,url).then((d)=>{resolve(d);});
        } else if(source == "bloomberg"){
            bloomberg.bloombergScrapper(html,url).then((d)=>{resolve(d);});
        } else if(source == "les-echos"){
            lesEchos.lesEchosScrapper(html,url).then((d)=>{resolve(d);});
        } else{
            resolve({"source":"Unknow","text":"","html":html,"source":source});
        }
    });
}

exports.scrapper = (url,timeout,source) => {
    return new Promise((resolve, reject) => {
        if(url.indexOf('wsj')>-1 && source == "the-wall-street-journal"){
            url = url.replace("https://www.wsj.com/","https://www.wsj.com/amp/");
        }
    
        if(url.indexOf('podcast')>-1){
           resolve({"source_id":"PodCast","newsURL":url,"text":"","html_page":""});
        } else{
            request(
                {'url':url,'Connection':'close'},
                (err, response) => {
                    if(response){
                        scrapperSelector(source, response.body, url)
                        .then((d)=>{
                            resolve(d);
                        });
                    }
                    if(err) {
                        reject(err);
                    }
                }
            );
        }
    });
}