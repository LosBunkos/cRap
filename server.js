const express = require('express');
const bodyParser = require('body-parser');

var app = express();
// app.use(morgan('dev'));

app.use(express.static(`${__dirname}/node_modules`));
app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// log requests

var port = process.env.PORT || '8000';

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
}); 


app.post('/getRap', (req, res, next) => {
  if (!req.body || !req.body.text) {
    console.log('got a req with no req.body');
    next('f u no req.body');
  }
    console.log('=====req start=====');
    let str = req.body.text;
    console.log("Got text:\n  ", str);
    let tokens = ext.init(req.body.text);
    console.log("\nTokenized to:\n ", tokens);
    ext.getWordsFromTokens(tokens, (werds) => {
      // setTimeout(()=> {
        genSentence(werds, (sentences)=> {
          sentences.tokens = tokens.split(' ');
          console.log(`\ngenerated:\n`, ...sentences.sentences);
          console.log('=====req end=====\n\nFrom:');
          sentences.original = str;
          res.json(sentences);
          })
        // }, 100);
    })


})

// app.get('/', function(req, res){
//   res.sendFile(__dirname + "/public/index.html");
// });


console.log('Running server on http://localhost:' + port);
app.listen(port);