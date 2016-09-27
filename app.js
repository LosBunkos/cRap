const express = require('express');
const bodyParser = require('body-parser');
const createSentence = require('./create_sentence');
const sentenceActions = require('./sentence_actions');
const wordExtractor = require('./extractor');

//tests

let str = 'The woman had died without pain, quietly, as a woman should whose life had been \
  blameless. Now she was resting in her bed, lying on her back, her eyes closed, her features \
  calm, her long white hair carefully arranged as though she had done it up ten minutes before dying'

str = wordExtractor.init(str);
wordExtractor.extractWords(str, (Words) => {
  wordExtractor.getMissingWords(Words, (Words2) => {
    wordExtractor.getRhymesForAll(Words2, (WordsAndRhymes) => {
      let sen1 = new createSentence.Sentence(sentenceActions.IAuxVerb, sentenceActions.myNoun);
      console.log(sen1.make(WordsAndRhymes))
      console.log(sen1.make(WordsAndRhymes))
      console.log(sen1.make(WordsAndRhymes))
      console.log(sen1.make(WordsAndRhymes))
      console.log(sen1.make(WordsAndRhymes))
      console.log(sen1.make(WordsAndRhymes))
    })
  })
})


















// var app = express();
// app.use(morgan('dev'));

// app.use(express.static(`${__dirname}/node_modules`));
// app.use(express.static(`${__dirname}/public`));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// // log requests

// var port = process.env.PORT || '8000';

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// }); 




// app.listen(port);



