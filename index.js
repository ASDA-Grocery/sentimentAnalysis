
'use strict';

const express = require('express')
    , bodyParser = require('body-parser')
    , sentiment = require("wink-sentiment")
    , app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.post('/analyze', function(req, res) {
    var speech
      , messages = new Array()
      , intent = req.body.result && req.body.result.metadata.intentName ? req.body.result.metadata.intentName : "noIntent";
    if(intent === 'UncertainIntent'){
        console.log('Inside Uncertain Intent')
        speech = 'Incide Uncertain Intent'
        return res.json({
            speech: speech,
            displayText: speech,
            source: 'sentiment-analyzer-backend'
        });
    }
    else{
        console.log('No intent received')
        speech = 'No intent Received'
        return res.json({
            speech: speech,
            displayText: speech,
            source: 'sentiment-analyzer-backend'
        });
    }
});

app.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});