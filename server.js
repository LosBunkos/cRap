const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const cs = require('./create_sentence');
const sa = require('./sentence_actions');
const ex = require('./extractor');

var app = express();
app.use(morgan('dev'));

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
  if(!(req && req.body && req.body.text)) {
    next('Error - Please make sure you\'re sending some text!');
  }
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let start = new Date().getTime();
  let input = req.body.text;
  input = ex.init(input);
  ex.extractWords(input, (Words) => {
    // ex.getMissingWords(Words, (Words2) => {
      let constructor = new cs.Sentencer(
        Words, sa.IUsedToBeANoun, ()=>'but now', sa.IVerbTheNoun
        );
      let sen1 = constructor.make();
      let sen2 = constructor.make();
      sen1.fillRhymes(()=> {
          sen2.fillRhymes(() => {
          let sen3 = constructor.rhyme(sen1);
          let sen4 = constructor.rhyme(sen2);
          let end = new Date().getTime();
          let time = end - start;
          console.log('===<Generated in |'+time+'ms| for ip |'+ip+'|>===')
          console.log(sen1.text)
          console.log(sen2.text)
          console.log(sen3.text)
          console.log(sen4.text)
          console.log('===</Generated>===')
          res.json({
            sentences: [sen1.text, sen3.text, sen2.text, sen4.text],
            tokens: input,
            took: time + 'ms'
          })
        })
      })
    // })
  })

})
// app.get('/', function(req, res){
//   res.sendFile(__dirname + "/public/index.html");
// });


console.log('Running server on http://localhost:' + port);
app.listen(port);