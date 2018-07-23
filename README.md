# Description
 This project was built in order to gather news data to enrich business process event logs for my graduation thesis and master course thesis and to support CoopIS 2018 submission ( Context-Aware Process Predictive Monitoring: The Impact of News Polarity ).

## AS IS
As is the code is a set of scripts ran semiautomatically to gather news from the NY Times News Archive API.
The NYT API require the year and month to bring news available for the days in this month of this year.

The response from the API is a collection of metadata JSON without the news content, this is stored in a NoSQL database, in our case, MongoDB.
The second function of this project is to iterate over this metadata collection and scrape the news content from their HTML pages by accessing the URL from NYT Metadata stored in Mongo, and create a new set of complete news. In parallel of building the complete set the second script append to the news object a set of sentiment analysis elements and country detection (as the NYT API and the HTML page don´t reference country information of the news).

### In order to Run this project follow these steps:

* Disclaimer: This code was developed for research purposes only. Due to continuos evolution of the research this code still needs modifications.

1. Download MongoDB, install it and configure it.

2. Download Node.js and configure it.

3. Download this project from Git.

4. Open it up, and on the project´s root folder issue the command `npm install` in the terminal.

5. Start your MongoDB local instance, and modify it´s needed references over the code, they should only be on src/mongo_db_module folder.

6. After everything is setup and the code is adapted to your env settings, then, issue `node ./src/news_api_module/news_gatherer.js` on the terminal, so the news metadata will be obtained and inserted into MongoDB. Inside the code, the method called is from_NY_Times(`startYear`,`endYear`,`month`,`index`,`MongoDBTargetCollectionName`), it is a recursion over the API, as it needs not only the year, but the month to get news metadata, so if we want a timerange we will recursivelly call the API till the end limit is reached.

7. After the data is inserted into the database, the terminal will be liberated again, so now we can activate the second script. Issue `node ./src/mongo_db_module/stream-study.js`, with it the script will scrape each news url present in the metadata collection and get the full content of the news and use a set of different sentiment analysers to classify those news' content. The main difference bewteen this js file and the news.js file in the same folder is that the news.js inserts metadata into the MongoDB, and the stream-study.js call scraping functions over the urls from metadata collection and insert the complete analyzed news into another collection. Hence its name, it also served as an attempt to study Node.js streams and it's methods, which guaranteed a better performance than a traditional loop like for or while. 

## Future Works

As said in the section before, this project needs some code reviews and refactors. Those, could not be done meanwhile the research time schedule for now, as I need to manage not only this but the master course itself and my job at IBM.

The mapped steps for better code are as follows:

1. Remove the orchestration of calling scrape functions and sentiment analysis functions from stream-study.js and allocate on another folder and file just for that as independent function, leaving the stream-study to its purpose, to handle with MongoDB operations usin streams.

2. Create a central function that has a method for all the project's independent parts, and also to call upon a method that would activate the entire process from zero.

3. Better document some methods in the MongoDB folder, and remove unecessary dependency calls.

4. To add new methods for other sources of news and to find a more generalistic news metadata API, like the NYT´s, but with more options for news sources.