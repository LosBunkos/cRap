var express = require('express');
var WordPOS = require('wordpos'),
    wordpos = new WordPOS();
var request = require('request');
var Tokenizer = require('sentence-tokenizer');
var tokenizer = new Tokenizer('Chuck');
var stopwords = require('stopwords').english;
var tense = require('tense');
var tensify = require('tensify'); //words from present to past
var toSimple = require('verbutils')();
const stopWords = stopwords.toString();

let str = "He was apparently not altogether serious; it certainly did not seem a place where any\
 artillerist, however brave, would like to put a gun.";




//the stopwords list


String.isStopWord = function(word) {
  let regex = new RegExp("\\b"+word+"\\b","i");
  let badWordsArr = ["isn't", "aren't", "wasn't","weren't", "haven't", "hasn't", "hadn't",
                     "hadn't", "won't", "wouldn't", "don't", "doesn't", "didn't", "can't",
                     "couldn't", "shouldn't", "mightn't", "mustn't", "would've", "should've",
                     "could've", "might've", "must've"]
  return !(stopWords.search(regex) < 0 || badWordsArr.indexOf(word) !== -1)
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

function init(str){
  str = str.removeStopWords();
  return str;
}

let fn = "kaki";
str = init(str);



getWordsAndRhymes(str, (Words)=> {
  howManyWordsMissing(Words);
})

//get words and request rhymes
function getWordsAndRhymes(str, fn){
  //this is for checking if there are enough words after getting them all into the words obj
  const wordAmount = 10;

  const Words = {
  nouns: [],
  adjectives: [],
  verbs: [],
  rest: []
  }

  //get the words
  wordpos.getPOS(str, function(result){
    let nouns = result.nouns;
    let verbs = result.verbs;
    let adjectives = result.adjectives;
    let rest = result.rest;
    
    for(n in nouns){
      let word = new Word(nouns[n].toLowerCase(), "noun");
      Words.nouns.push(word);
    }

    for(v in verbs){
      let word = new Word(verbs[v].toLowerCase(), "verb");
      Words.verbs.push(word);
    }

    for(a in adjectives){
      let word = new Word(adjectives[a].toLowerCase(), "adjective");
      Words.adjectives.push(word);
    }

    //anything that wasn't categorized into a pos, make it present simple and check if a verb
    for (r in rest){
      let word = toSimple.toBaseForm(rest[r]);
      wordpos.isVerb(word, function(result){
        if (result){
          word = new Word(word, "verb");
          Words.verbs.push(word)
        } else {
          word = new Word(word, "rest");
          Words.rest.push(word);
        }
      })
    }

    setTimeout(()=>fn(Words), 100);
  })
}


//check how many words are missing in every pos for 10 and get syns
function howManyWordsMissing(Words){  
  let neededAmount = 10;

  //check missing verbs
  if (Words.verbs.length <= neededAmount){
    let missing = neededAmount - Words.verbs.length;
    let getPerWord = Math.round(missing /Words.verbs.length);
    let getFirst = (missing%Words.verbs.length) + getPerWord;

    if (getFirst !== 0){
    getSyns(Words.verbs[0].word, Words, getFirst)
    }

    for (let i = 1; i < Words.verbs.length; i++){     
      if (getPerWord === 0){break;}
      getSyns(Words.verbs[i].word, Words, getPerWord)
    }
  }

  //check missing nouns
  if (Words.nouns.length <= neededAmount){
    let missing = neededAmount - Words.nouns.length;
    let getPerWord = Math.round(missing /Words.nouns.length);
    let getFirst = (missing%Words.nouns.length) + getPerWord;

    if (getFirst !== 0){
    getSyns(Words.nouns[0].word, Words, getFirst)
    }

    for (let i = 1; i < Words.nouns.length; i++){     
      if (getPerWord === 0){continue;}
      getSyns(Words.nouns[i].word, Words, getPerWord)
    }
  }

  //check missing adjs
  if (Words.adjectives.length <= neededAmount){
    let missing = neededAmount - Words.adjectives.length;
    let getPerWord = Math.round(missing /Words.adjectives.length);
    let getFirst = (missing%Words.adjectives.length) + getPerWord;

    if (getFirst !== 0){
    getSyns(Words.adjectives[0].word, Words, getFirst)
    }

    for (let i = 1; i < Words.adjectives.length; i++){     
      if (getPerWord === 0){}
      getSyns(Words.adjectives[i].word, Words, getPerWord)
    }
  } 

  //check missing verbs 
  if (Words.verbs.length <= neededAmount){
    let missing = neededAmount - Words.verbs.length;
    let getPerWord = Math.round(missing /Words.verbs.length);
    let getFirst = (missing%Words.verbs.length) + getPerWord;

    if (getFirst !== 0){
    getSyns(Words.verbs[0].word, Words, getFirst)
    }

    for (let i = 1; i < Words.verbs.length; i++){     
      if (getPerWord === 0){}
      getSyns(Words.verbs[i].word, Words, getPerWord)
    }
  } 
  }


//this function checks the syns coming back and shoves them where they need to go
function checkType(synArr, Words){
  var check = synArr.toString();
  wordpos.getPOS(check, function(result){
    let count = result.adjectives.length;
    if(count > 0){
      for (let i = 0; i < count; i++){
        let word = result.adjectives[i];
        word = new Word(word, "adjective")
        Words.adjectives.push(word);
      }
    }

    count = result.nouns.length;
    if (count > 0){
      for (let i = 0; i < count; i++){
        let word = result.nouns[i];
        word = new Word(word, "noun")
        Words.nouns.push(word);
      }
    }

    count = result.verbs.length;
    if (count > 0){
      for (let i = 0; i < count; i++){
        let word = result.verbs[i];
        word = new Word(word, "verb")
        Words.verbs.push(word);
      }
    }

    if(Words.nouns.length > 10){Words.nouns.splice(10, 999999999)}
    if(Words.adjectives.length > 10){Words.adjectives.splice(10, 999999999)}
    if(Words.verbs.length > 10){Words.verbs.splice(10,999999999)}
  })

  setTimeout(function(){console.log(Words, "done logging")}, 3000)
}


function getSyns(word, Words, howmanytoget, fn) {
  let synArr = [];
  let search = word;
  request('https://api.datamuse.com/words?ml='+search + '&max=100', function(err, res, body){

    for (let i = 0; i < howmanytoget; i++){
      //if body is empty returns as [] which is length 2, in this case return
      if (body.length === 2){
        return;
      }

      let syn = JSON.parse(body)[i];

      if(checkIfExists(syn, Words) || syn.word.includes(" ")){

        i++
        }
       else { 
        if (typeof syn !== 'undefined'){
          synArr.push(syn.word)
        }
      }
    }
  // fn();
  setTimeout(function(){checkType(synArr, Words)},1000)
  })
}

function checkIfExists(word, Words){
  var types = ["nouns", "verbs", "adjectives"];
  for(let j = 0; j < types.length; j++) {
    let wordList =  Words[types[j]];
    for (let i = 0; i < wordList.length ; i++) {
      if (word === wordList[i].word) {
        return true
      }
    }
  }
  return false;  
}


//create a word class
class Word{
  constructor(word, type, syns){
    this.word = word,
    this.pos = type
  }

  getRhymes(fn){
    let that = this;
    that.rhymes = [];
    request('https://api.datamuse.com/words?rel_rhy=' + that.word+'&max=10', function(err, res, body){
      if (err){
        console.log("there was an error:", err);
        throw new Error(err, "cannot connect to API");
      }
      if (body.length === 2) {
        console.log("no rhymes found:", that.word, body)
        return;
      }
      for (let i = 5; i < 10 ; i++){
        let rhyme = JSON.parse(body)[i];
        that.rhymes.push(rhyme);
      }
      this.rhymes = that.rhymes;
      fn();
    })
  }
}

module.exports = {init : init,
                  getWordsAndRhymes : getWordsAndRhymes, 
                  // extractForShortSentances : extractForShortSentances, 
                  Word:Word,
                  getSyns:getSyns}








