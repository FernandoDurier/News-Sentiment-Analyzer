const mongo_url = 'mongodb://127.0.0.1:27017/news-analysis';
//var mongo_url = 'mongodb://127.0.0.1:27018/news-analysis';

const MongoClient = require('mongodb').MongoClient;

const scr = require('../web_scrapper_module/scrapper.js');
const snta = require('../sentiment_analysis_module/sentiment_analysis.js');
const country_detect = require('../country_detector_module/country_detector.js');

const conoption = {
    socketTimeoutMS: 1040000,
    keepAlive: true,
    reconnectTries: 3000000,
    autoReconnect:true
};

const nyt_categories = require('./../web_scrapper_module/nyt/news-categories-of-interest');
let news_categories = nyt_categories.getCategories();

let transceive = (data) => {
    return new Promise((resolve, reject) => {
        let meta = data;
        scr.scrapper(data.web_url,1,'nyt')
        .then((data)=>{
            let fdata = Object.assign(meta,data);
            //console.log("Fdata: ", fdata);
            resolve(fdata);
        })
        .catch((error) => {
            console.log("Scrapper Error: ", error);
            reject(error);
        });
    });
}

exports.xstream = function(collectionname,log,keywordsSet,startDate,endDate){

    let counter = 0;
    MongoClient.connect(mongo_url,conoption,
        (err,db) => {
            let query = db.collection(collectionname).find(
                {
                    "news_desk":{"$in":news_categories},
                    "pub_date": {
                        $gte: (startDate),
                        $lt: (endDate)
                    }
                },
                {batchSize:1,_id:1,timeout:false}
            ).sort({"pub_date":-1}).stream();

            query.on("data", (d) => {
                query.pause();
                console.log("counter:",counter+=1);
                transceive(d)
                .then((data)=>{
                    for(let i = 0; i<keywordsSet.length; i++){
                        if(data.text.indexOf(keywordsSet[i])>-1){
                            data.has_log_keyword = true;
                        }
                        else{
                            data.has_log_keyword = false;
                        }
                    }
                    db.collection("attempt4-final-nyt-news-"+log).insert(
                        Object.assign(
                            data,
                            {"news_body_data":snta.analysis(data.text)},
                            {"news_headline_data":snta.analysis(data.headline.main)},
                            {"country_meta":country_detect.detect_country(data.text)}
                        ),
                        (err,doc) => {
                            if (err) {
                                console.log("-----------------Insertion-Error-----------------------");
                                console.log(err);
                                console.log("-------------------------------------------------------");
                                db.close();
                            } else {
                                query.resume();
                            }
                        }
                    );
                })
                .catch((error)=>{
                    console.log("Transceiver Error: ", error);
                    query.resume();
                });
            });

            query.on("error", (error) => {
                console.log("------------Stream-Error--------------");
                console.log(error);
                console.log("--------------------------------------");
                db.close();
            });

            query.on("end", () => { 
                console.log("-------------Streaming is done--------");
                db.close();
                return true;
            });

        }
    );
}

let logs = ['bpic2012','bpic2013','italian-log'];
let keywordsSet = [
    ['finances','debt','loan','overdraft','tax','economics'],
    ['volvo','car','industry','technology','vinst','recall','economy'],
    ['traffic','fine','parking','road']
];

//this.xstream("nyt-metadata-2-"+logs[0],logs[0],keywordsSet[0],"2011-09-29","2012-03-14");
//this.xstream("nyt-metadata-2-"+logs[1],logs[1],keywordsSet[1],"2012-01-01T00:00:00","2012-05-23T00:00:00");
this.xstream("nyt-metadata-2-"+logs[2],logs[2],keywordsSet[2],"2000-01-01","2013-06-17");



