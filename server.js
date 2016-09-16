var express = require('express');
var request = require('request');
var fs = require('fs');

var app = express();

app.get('/:query', function(req, res) {
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
          res.json(newArr);
        }
      });
  });

});

app.listen(process.env.PORT);
