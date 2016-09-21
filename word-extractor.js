var express = require('express');
var WordPOS = require('wordpos'),
    wordpos = new WordPOS();
var request = require('request');
var Tokenizer = require('sentence-tokenizer');
var tokenizer = new Tokenizer('Chuck');
var stopwords = require('stopwords').english;
var tense = require('tense');
var tensify = require('tensify'); //words from present to past


//the stopwords list
const stopWords = stopwords.toString();

String.isStopWord = function(word) {
  let regex = new RegExp("\\b"+word+"\\b","i");
  if(stopWords.search(regex) < 0)
  {
    return false;
  }else
  {
    return true;  
  }
}

String.prototype.removeStopWords = function() {
  words = new Array();
  this.replace(/\b[\w]+\b/g,
    function($0) {
      if(!String.isStopWord($0))
      {
        words[words.length] = $0.trim();
      }
    }); 
    return words.join(" ");
}


function removeStopwords(str) {
  const separateSentancesWithoutStopWords = [];
  for (s in strToSentences){
  separateSentancesWithoutStopWords.push(strToSentences[s].removeStopWords());
  }
  return separateSentancesWithoutStopWords;
}

//split the text into complete sentences
function tokenizeString(str) {
  tokenizer.setEntry(str);
  return tokenizer.getSentences();
}

//user text input, for now with sample text
const str = 'A short story is a piece of prose fiction that can be read in one sitting.\
  Emerging from earlier oral storytelling traditions in the 17th century, the short story\
  has grown to encompass a body of work so diverse as to defy easy characterization';

const Words = {
  nouns: [],
  adjectives: [],
  verbs: [],
  names: []
};

//get words and request rhymes
function getWordsAndRhymes(separateSentancesWithoutStopWords){
  for (s in separateSentancesWithoutStopWords) {
    wordpos.getAdjectives(separateSentancesWithoutStopWords[s], function(adj){
      for (let n = 0 ; n < adj.length ; n++){
        let word = new Word(adj[n], "adjective");
        word.getRhymes(()=>{
          Words.adjectives.push(word);
        });
      }
    })

    wordpos.getVerbs(separateSentancesWithoutStopWords[s], function(verb){
      for (let n = 0 ; n < verb.length ; n++){
        let word = new Word(verb[n], "verb");
        word.getRhymes(()=>{
          Words.verbs.push(word);
        });
      }
    })   

    wordpos.getNouns(separateSentancesWithoutStopWords[s], function(noun){
      for (let n = 0 ; n < noun.length ; n++){
        let word = new Word(noun[n], "noun");
        word.getRhymes(()=>{
          Words.nouns.push(word)
        });
      }
    })     
  }
}

function getUnclassifiedWords (strToSentences) {
  let words = strToSentences.join(" ").split(" ");
  for (let i = 0; i < words.length ; i++){
    wordpos.getPOS(words[i], function(result) {
      let word = result.rest.toString();
      if (word.length > 0){ 
        let input = new Word(word, "name");
        input.getRhymes(()=>{
          Words.names.push(input);
        })
      }
    })
  }
}


//tokenize the input str and clean out the stopwords
const strToSentences = tokenizeString(str);
const separateSentancesWithoutStopWords = removeStopwords(strToSentences);

//get the verbs, nouns, adjs and rest and make Word classes that will be pushed into the Words obj by arrays.
getWordsAndRhymes(separateSentancesWithoutStopWords);
getUnclassifiedWords(separateSentancesWithoutStopWords);


//create a word class
class Word{
  constructor(word, type){
    this.word = word,
    this.pos = type
  }

  getRhymes(fn){
    let that = this;
    that.rhymes = [];
    request('https://api.datamuse.com/words?rel_rhy=' + that.word, function(err, res, body){
      if (err){
        console.log(err);
        throw new Error(err, "cannot connect to API");
      }
      // empty response: '[]'.length === 2
      if (body.length === 2) {
        console.log("no rhymes bitch:", body)
        return;
      }
      for (let i = 0; i < 6 ; i++){
        let rhyme = JSON.parse(body)[i];
        that.rhymes.push(rhyme);
      }
      this.rhymes = that.rhymes;
      fn();
    })
  }
}





