var express = require('express');
var WordPOS = require('wordpos'),
    wordpos = new WordPOS();
var request = require('request');
var Tokenizer = require('sentence-tokenizer');
var tokenizer = new Tokenizer('Chuck');
var stopwords = require('stopwords').english;
var tense = require('tense');
var tensify = require('tensify'); //words from present to past


function init(str){
  str = str.removeStopWords();
  return str;
}

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


// function removeStopwords(str) {
//   let str = [str];
//   const strWithoutStopWords = [];
//   for (s in str){
//   strWithoutStopWords.push(str[s].removeStopWords());
//   }
//   return strWithoutStopWords;
// }

//split the text into complete sentences
// function tokenizeString(str) {
//   tokenizer.setEntry(str);
//   return tokenizer.getSentences();
// }

let str = init("Once you think you have what it takes you can battle other members on the site. \
You can choose a specific member or request someone to challenge you. You can also specify \
rules and limits on the length of the battle. Once the battle begins, other members can vote for who wins.")

const pass = getWordsAndRhymes(str);
// getUnclassifiedWords(str, pass)

//get words and request rhymes
function getWordsAndRhymes(str){
  const Words = {
  nouns: [],
  adjectives: [],
  verbs: [],
  names: []
  }

  wordpos.getAdjectives(str, function(adj){
    for (let n = 0 ; n < adj.length ; n++){
      let word = new Word(adj[n], "adjective");
      Words.adjectives.push(word);
    }
  })

  wordpos.getVerbs(str, function(verb){
    for (let n = 0 ; n < verb.length ; n++){
      let word = new Word(verb[n], "verb");
      Words.verbs.push(word);
    }
  })   

  wordpos.getNouns(str, function(noun){
    for (let n = 0 ; n < noun.length ; n++){
      let word = new Word(noun[n], "noun");
      Words.nouns.push(word);
    }
  })

  let words = [str].join(" ").split(" ");
  for (let i = 0; i < words.length ; i++){
    wordpos.getPOS(words[i], function(result) {
      let word = result.rest.toString();
      if (word.length > 0){ 
        let input = new Word(word, "name");
        Words.names.push(input);
      }
    })
  }

  setTimeout(()=> {
     return Words;
  }, 500);
}


//for short inputs get the words and then find 2 synonyms for each
function extractForShortSentances(str) {

  const Words = {
  nouns: [],
  adjectives: [],
  verbs: [],
  names: []
  }

  wordpos.getPOS(str, function(result){
    nouns = result.nouns;
    verbs = result.verbs;
    adjectives = result.adjectives;
    names = result.rest;

    for(n in nouns){
      let word = new Word(nouns[n], "noun");
      word.getSyns(()=> {
        Words.nouns.push(word);
      });
    }
    for(v in verbs){
      let word = new Word(verbs[v], "verb");
      word.getSyns(()=> {
        Words.verbs.push(word);
      });
    }
    for(a in adjectives){
      let word = new Word(adjectives[a], "adjective");
      word.getSyns(()=> {
        Words.adjectives.push(word);
      });
    }
    for(n in names){
      let word = new Word(names[n], "names");
      word.getSyns(()=> {
        Words.names.push(word);
      });
    }  
  })
  return Words;
}



//get the verbs, nouns, adjs and rest and make Word classes that will be pushed into the Words obj by arrays.
// getWordsAndRhymes(separateSentancesWithoutStopWords);
// getUnclassifiedWords(separateSentancesWithoutStopWords);
// extractForShortSentances(str) //if the sentence is short

//create a word class
class Word{
  constructor(word, type, syns){
    this.word = word,
    this.pos = type
  }

  getRhymes(fn){
    let that = this;
    that.rhymes = [];
    request('https://api.datamuse.com/words?rel_rhy=' + that.word, function(err, res, body){
      if (err){
        console.log("there was an error:", err);
        throw new Error(err, "cannot connect to API");
      }
      if (body.length === 2) {
        console.log("no rhymes found:", that.word, body)
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

  getSyns(fn) {
    let that = this;
    that.syns =[];
    request('https://api.datamuse.com/words?rel_syn='+that.word, function(err, res, body){
      // console.log(searchWord)
      for(let i = 0; i < 2; i++){
        let syn = JSON.parse(body)[i];
        if (typeof syn !== 'undefined'){
          that.syns.push(syn);
        }
      }
    this.syns = that.syns;
    fn();
    })
  }
}


module.exports = {init : init, getWordsAndRhymes : getWordsAndRhymes, extractForShortSentances : extractForShortSentances, Word:Word}








