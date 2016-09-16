var express = require('express');
var request = require('request');
var fs = require('fs');
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;
var mongoURL = process.env.MONGO;
var app = express();

MongoClient.connect(mongoURL, function(err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', error);
  } else {
    console.log('Connection established to', mongoURL);
  }

  var collection = db.collection('searches');

  app.get('/api/latest', function(req, res) {
    collection.find({},{_id: 0, term: 1, when: 1},function(err, cursor) {
      cursor.sort({when: -1}).limit(10).toArray(function(err, items) {
        res.json(items);
      })
    });
  });

  app.get('/api/:query', function(req, res) {
    // Read in API key
    fs.readFile('api.key', function(err, data) {
        var apiKey = data;
        var query = req.params.query;
        var queryString = 'https://www.googleapis.com/customsearch/v1?q=' + query + '&cx=006762283887135438198%3Ay9tcn92rqp4&searchType=image&key=' + apiKey;

        // request(queryString, function(error, response, body) {
        //   if (!error && response.statusCode == 200) {
        //     var origRes = JSON.parse(body);
        //     var newArr = origRes.items.map(function(currentValue, index, array) {
        //       return {
        //         url: currentValue.link,
        //         snippet: currentValue.snippet,
        //         thumbnail: currentValue.image.thumbnailLink,
        //         title: currentValue.title,
        //         context: currentValue.image.contextLink
        //       };
        //     });
        //     res.json(newArr);
        //   }
        // });

        //Mock out Google API for testing without hitting quota (100/day)
        var response = {statusCode: 200};
        fs.readFile('testAPI.json', 'utf8', function(error, body) {
          if (!error && response.statusCode == 200) {
            var origRes = JSON.parse(body);
            var newArr = origRes.items.map(function(currentValue, index, array) {
              return {
                url: currentValue.link,
                snippet: currentValue.snippet,
                thumbnail: currentValue.image.thumbnailLink,
                title: currentValue.title,
                context: currentValue.image.contextLink
              };
            });
            collection.insert({term: query, when: new Date().toISOString()});
            res.json(newArr);
          }
        });
    });

  });
});
app.listen(process.env.PORT);
