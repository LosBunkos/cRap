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
      let sen1 = new createSentence.Sentence(sentenceActions.IAuxVerb, sentenceActions.myNoun);
      let builtSentence = sen1.make(Words2);
      // console.log(builtSentence.split(" "));
      sen1.rhyme(Words2, builtSentence, (Reim)=> {
        console.log(builtSentence)
        console.log(Reim);
      })
  })
})



