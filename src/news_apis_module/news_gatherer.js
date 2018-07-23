var request = require('request');
var Q = require('q');
var mongo = require('../mongo_db_module/news.js')

const resolver = function(){
    var newsDefer = Q.defer();
    newsDefer.resolve({"status":200});
    return newsDefer.promise;
}
const from_NY_times = function(startYear,endYear,month,index,elog){
    console.log("Begin nyt:",startYear);
    console.log("End nyt:",endYear);
    console.log("Month:",month);
    
    if(startYear==endYear && month==13){
        console.log("End of recursion ...");
        return resolver();
    }
    else{
        request.get({
            url: "https://api.nytimes.com/svc/archive/v1/"+startYear+"/"+month+".json",
            qs: {
            'api-key': "82977afb68694b548c0fd53cc873608c"
            },
        }, function(err, response, body) {
            if(err){
                console.log("Error: ",err);
            }
            if(JSON.parse(body).response){
                news_metadata = JSON.parse(body).response.docs;
                //console.log(Object.keys(news_metadata.response));
                //newsDefer.resolve({"status":response.statusCode,"body":news_meatada});
                setTimeout(
                    ()=>{
                        var indata = news_metadata;
                        //console.log("Data to be bulk inserted: ", indata);
                        //console.log("Inserting docs ..."); 
                        mongo.bulk('nyt-metadata-2-'+elog,indata);
                    },500
                );
            }
            
            if(month==12 && startYear!=endYear){month=0;startYear+=1;}
            setTimeout(() => {
                from_NY_times(startYear,endYear,month+1,index+1,elog);
            }, ((index+1)%10)*1000);
        });
    }
    
}

from_NY_times(2009,2012,1,0,'bpic2013');
//from_NY_times(2011,2012,1,0,'bpic2012');
//from_NY_times(2016,2017,1,0,'bpic2012');
//from_NY_times(2000,2013,1,0,'italian-log');