
'use strict';

const express = require('express')
    , bodyParser = require('body-parser')
    , sentiment = require("wink-sentiment")
    , app = express();

var complaints = new Array()
  , appreciations = new Array()
  , unsureTexts = new Array()
  , issueId = 'IS100000';

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/test/queries/:type', (req, res) => {
  if(req.params.type === 'appreciations'){
    res.send(appreciations)
  }
  else if(req.params.type === 'complaints'){
    res.send(complaints)
  }
  else if(req.params.type === 'unsure'){
    res.send(unsureTexts)
  }
  else{
    console.log('Sorry! invalid category!');
  }
})

app.post('/analyze', function(req, res) {
    var speech
      , messages = new Array()
      , intent = req.body.result && req.body.result.metadata.intentName ? req.body.result.metadata.intentName : "noIntent";
      
    if(intent === 'UncertainIntent'){
        speech = 'Inside Uncertain Intent'
        console.log('Inside Uncertain Intent')
        var query = req.body.result && req.body.result.resolvedQuery? req.body.result.resolvedQuery : 'noQuery';
        
        if(query === 'noQuery'){
            speech = 'No query Received'
        }
        else{
          var result;
          if(query.includes('but') || query.includes('however')){
            var queryArray = query.split(/\s+(?:but|however)\s+/)
            console.log(queryArray[queryArray.length - 1]);
            result = sentiment(queryArray[queryArray.length - 1])
          }
          else{
            result = sentiment(query)
          }
          if(result.score > 1){
            appreciations.push(query)
            speech = 'Thank you for the appreciation.'
          }
          else if(result.score < -1){
            complaints.push(query)
            speech = 'Thank you for the feedback. Your complaint number is ' + issueId + ', please note it for future references.'
          }
          else{
            unsureTexts.push(query)
            speech = 'I am not sure I understood what you said. I am forwarding this to my team, somebody will be in touch with you soon.'
          }
        }
        
        return res.json({
            speech: speech,
            displayText: speech,
            source: 'sentiment-analyzer-backend'
        });
    }
    
    else if(intent === 'purchasedProductComplaintConversation' || intent === 'complaintConversation'){
        speech = 'Inside purchasedProductComplaintConversation Intent'
        console.log('Inside purchasedProductComplaintConversation Intent')
        var indexOfProductData = req.body.result.contexts.findIndex((x) => x.name === 'purchasedproductconversation' || x.name === 'usercomplaint')
          , product = req.body.result.contexts[indexOfProductData].parameters.products ? req.body.result.contexts[indexOfProductData].parameters.products : 'noSpecificProduct'
          , orderId = req.body.result.parameters.any ? req.body.result.parameters.any : 'noOrderId';
        if(orderId === 'noOrderId'){
            speech = 'Sorry! you have to provide an Order Id for us to look into the issue.'
        }
        else{
            var orderReg = /^[OR]{2}[0-9]{6}$/g
            var result = orderId.match(orderReg)
            if(result == null){
                speech = 'Please provide a proper Order Id!!'
                console.log('Invalid Order Id.')
            }
            else{
                var tempIssue = parseInt(issueId.substring(2)) + 1
                issueId = 'IS' + tempIssue
                speech = 'Your issue has been created for a malfunctioning ' + product + '. The issue number is ' + issueId + '. Please keep it for future references.'
            }
        }
        return res.json({
            speech: speech,
            displayText: speech,
            source: 'sentiment-analyzer-backend'
        });
    }
    
//     else if(intent === 'complaintConversation'){
//         console.log('Inside complaintConversation Intent')
//         speech = 'Inside complaintConversation Intent'
//         var indexOfProductData = req.body.result.contexts.findIndex((x) => x.name === 'usercomplaint')
//           , product = req.body.result.contexts[indexOfProductData].parameters.products ? req.body.result.contexts[indexOfProductData].parameters.products : 'noSpecificProduct'
//           , orderId = req.body.result.parameters.any ? req.body.result.parameters.any : 'noOrderId';
//         return res.json({
//             speech: speech,
//             displayText: speech,
//             source: 'sentiment-analyzer-backend'
//         });
//     }
        
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
