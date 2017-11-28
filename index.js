
'use strict';

const express = require('express')
    , bodyParser = require('body-parser')
    , sentiment = require("wink-sentiment")
    , app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.post('/test', function(req, res) {
    var speech
      , messages = new Array()
      , intent = req.body.result && req.body.result.metadata.intentName ? req.body.result.metadata.intentName : "noIntent";

});

app.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
