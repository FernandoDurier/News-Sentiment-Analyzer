var mongo_url = 'mongodb://127.0.0.1:27017/news-analysis';
//var mongo_url = 'mongodb://127.0.0.1:27018/news-analysis';
const Q = require('q');
var mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var ObjectID = mongo.ObjectID;
const conoption = {
    socketTimeoutMS: 1040000,
    keepAlive: true,
    reconnectTries: 3000000,
    autoReconnect:true
};
exports.bulk = function(collection,data) {
    MongoClient.connect(mongo_url, function(err, db) {
        if (err) throw err;
        // db pointing to newdb
        console.log("Switched to "+db.databaseName+" database");
        
        // insert document to 'users' collection using insertOne
        for(dat in data){
            var prepared = data[dat];
            prepared._id = new ObjectID();
            db.collection(collection,conoption).insertOne(prepared, function(err, res) {
                if (err) throw err;
                console.log("Document inserted");
                // close the connection to db when you are done with it
                db.close();
            });
        }
    }); 
}

exports.insertOne = function(collection,data){
    MongoClient.connect(mongo_url,conoption,function(err, db) {
        if (err) throw err;
        // db pointing to newdb
        console.log("Data:",Object.keys(data));
        console.log("Switched to "+db.databaseName+" database");
        
        // insert document to 'users' collection using insertOne
        
        var prepared = data;
        prepared._id = new ObjectID();
        db.collection(collection).insertOne(prepared, function(err, res) {
            if (err) {throw err;}
            console.log("Document inserted");
            // close the connection to db when you are done with it
            db.close();
        });
        
    }); 
}


exports.find = function(collection,query){
    var finderQ = Q.defer();
    console.log("Queried collection:",collection);
    console.log("Query:", query);
    MongoClient.connect(mongo_url, function(err, db) {
        if (err) throw err;
        var dbo = db;
        //var query = { address: "Park Lane 38" };
        dbo.collection(collection).find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log("Result Size:", result.length);
          finderQ.resolve({"status":200,"body":result});
          db.close(); 
        });
    });
    return finderQ.promise;
}

var poolConn;
MongoClient.connect(mongo_url,conoption,
  function(err, db) {
    if (err) throw err;
    // db pointing to newdb
    poolConn = db;
}); 

exports.insertPooled = function(collection,data,index,limit){
    console.log("-------------pool(",index,"/",limit,")---------------------");
    if(index < limit){
        //console.log("Data:",Object.keys(data));
        //console.log("Switched to "+db.databaseName+" database");
        var prepared = data;
            prepared._id = new ObjectID();
        poolConn.collection(collection).insertOne(prepared, function(err, res) {
            if (err) throw err;
            console.log("Document inserted");
            // close the connection to db when you are done with it
            //poolConn.close();
        });
    }
    else{
        console.log("Closing the pool ...");
        poolConn.close();
    }
}

var inOnePooled = function(collection,data){
    poolConn.collection(collection).insert(data, function(err, res) {
        if (err) throw err;
        console.log("Document pooled inserted");
        // close the connection to db when you are done with it
        //poolConn.close();
    });
}

var snta = require('../sentiment_analysis_module/sentiment_analysis.js');
var inOne = require('./news.js').insertOne;
var mong = require('./news.js');
exports.xstream = function(collectionname,callback,reference){
    var  counter = 0;
    
    MongoClient.connect(mongo_url,conoption,
        function(err,db) {

        var query = db.collection(collectionname).find({},{"batchSize":1}).stream();

            query.on("data", function(d) {
                var meta = d; 
                //console.log("Pause the stream for processing ...");
                query.pause();
                callback(d)
                .then((data)=>{
                    //console.log("................ Stream .....................");
                    //console.log(1);
                    var fdata = Object.assign(meta,data);
                    //console.log(2);
                    var newsBody = null;
                    if(fdata.body.text){
                        newsBody = {"news_body_analysis":snta.analysis(fdata.body.text)};
                    }
                    //console.log(3);
                    var newsHeader = null;
                    if(fdata.title){
                        newsHeader = {"news_header_analysis":snta.analysis(fdata.title)}
                    }
                    //console.log(4);
                    var finalJson = {};
                    if(newsBody || newsHeader){
                        finalJson = Object.assign(fdata,newsHeader,newsBody);
                    }
                    //console.log(5);
                    counter++;
                    console.log("Progress:",counter);
                    db.collection(reference+'-full-news').insert(finalJson,(err,doc)=>{
                        if(err){
                            console.log("Insertion Error:",err);
                            query.resume();
                        }
                        else{
                            //console.log("Inserting this Doc:", doc);
                            query.resume();
                        }
                            
                    });
                    //console.log(".............................................");
                });

            });
            query.on("error", function(error){
                console.log("Error:", error);
            });
            query.on("end", function() { 
                console.log("Streaming is done");
                //db.collection('nyt-full-news-'+year).insertMany(finalArray);
            });

        }
    );
}

var scr = require('../web_scrapper_module/scrapper.js');
var st = require('./news.js').xstream;
var ec = require('./news.js').each;
var cb = function(data){
    var cbDefer = Q.defer();
    console.log("Scrapping URL:", data.url);
    scr.scrapper(data.url,100,data.source.id)
    .then((data)=>{
        cbDefer.resolve(data);
    });
    return cbDefer.promise;
};

//st("news-api-metadata-italian",cb,'italian');
