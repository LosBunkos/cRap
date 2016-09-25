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

let str = "There are predictions that Monday night’s debate will shatter records,\
 as one recent headline put it, drawing a Super Bowl-size audience of more than million viewers\
 goes went stayed flayed.";




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
    // console.log(result)
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


//don't forget synMissing
function howManyWordsMissing(Words){  
  let neededAmount = 10;

  //check missing verbs
  if (Words.verbs.length < neededAmount){
    let missing = neededAmount - Words.verbs.length;
    let getPerWord = Math.round(missing /Words.verbs.length);
    let getFirst = (missing%Words.verbs.length) + getPerWord;

    if (getFirst !== 0){
    getSyns(Words.verbs[0].word, Words, getFirst)
    }

    for (let i = 1; i < missing; i++){     
      if (getPerWord === 0){return}
      getSyns(Words.verbs[i].word, Words, getPerWord)
    }
  }
    // for (let i = 0; i<missing ; i++){
    //   if (i === 0){
    //     getSyns(Words.verbs[0].word, Words, )
    //   }
    //   getSyns(Words.verbs[i].word, Words, missing)
    // }
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
  })

}


function getSyns(word, Words, howmanytoget, fn) {
  let synArr = [];
  console.log("this is how many", howmanytoget)
  request('https://api.datamuse.com/words?ml='+word.word+'&max=10', function(err, res, body){
    // console.log(searchWord)
      for (let i = 0; i < howmanytoget; i++){
        let syn = JSON.parse(body)[i];
        // console.log(syn)
        if (typeof syn !== 'undefined'){
          synArr.push(syn.word)
          // console.log(synArr)
       }
      }
  // fn();
  setTimeout(function(){checkType(synArr, Words)},1000)
  })
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








