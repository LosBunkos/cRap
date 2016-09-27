const WordPOS = require('wordpos'),
    wordpos = new WordPOS();
const request = require('request');
const stopwords = require('stopwords').english;
const toSimple = require('verbutils')();

const allPos = ["nouns", "verbs", "adjectives"];
// plural pos --> sigular
const typeFromArrName = (arr)=> arr.substr(0, arr.length - 1);
const stopWords = stopwords.toString();

class WordsObj {
  constructor() {
    this.nouns = [],
    this.adjectives = [],
    this.verbs = [],
    this.rest = []
  }
}
// declare i with value 0
let i = 0;

class Word {
  constructor(word) {
    this.word = word
  }

  getRhymes(fn) {
    let that = this;
    that.rhymes = [];
    request('https://api.datamuse.com/words?rel_rhy=' + that.word+'&max=10', function(err, res, body) {
      if (err) {
        console.log("there was an error:", err);
        throw new Error(err, "cannot connect to API");
      }
      if (body.length === 2) {
        console.log("no rhymes found:", that.word, body)
        return;
      }
      for (let i = 5; i < 10 ; i++) {
        let rhyme = JSON.parse(body)[i];
        that.rhymes.push(rhyme);
      }
      this.rhymes = that.rhymes;
      fn();
    })
  }
}

String.isStopWord = function(word) {
  let regex = new RegExp("\\b"+word+"\\b","i");
  let badWordsArr = ["isn't", "aren't", "wasn't","weren't", "haven't", "hasn't", "hadn't",
                     "hadn't", "won't", "wouldn't", "don't", "doesn't", "didn't", "can't",
                     "couldn't", "shouldn't", "mightn't", "mustn't", "would've", "should've",
                     "could've", "might've", "must've" ]
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

function init(str) {
  str = str.removeStopWords();
  return str;
}

function _extractWords(str, fn) {
  const Words = new WordsObj();
  wordpos.getPOS(str, function(result) {
    let rest = result.rest 
    //dont forget to deal with rest later!!!
    allPos.forEach((pos) => {
      result[pos].forEach((word) => {
        word = new Word(word.toLowerCase());
        Words[pos].push(word);
      }) 
    });
    rest.forEach((word) => {
      word = toSimple.toBaseForm(word);
      wordpos.isVerb(word, function(result) {
        if (result) {
          word = new Word(word);
          Words.verbs.push(word);
        } else {
          word = new Word(word);
          Words.rest.push(word);
        }
      })
    }) 
  })
  setTimeout(function(){fn(Words)}, 50);
}

function _getAmountOfMissing (Words, needed = 10) {
  let missingObj = {total: 0};
  allPos.forEach((pos) => {
    let missing = needed - Words[pos].length;
    if (missing >= 0) {
      missingObj[pos] = missing;
    } else {
      missingObj[pos] = 0;
    }
    missingObj.total += missingObj[pos];
  }) 
  return missingObj; 
}

function _getSimilarWords (word, count, fn) {
  let similarWords = new WordsObj();
  request('https://api.datamuse.com/words?ml=' + word + '&max=' + count, function(err, res, body){

  for (let i = 0 ; i < count ; i++){
    //if the res empty - return
    if (body.length === 2 ) {
      return false;
    } else {
      let syn = JSON.parse(body)[i];
      if (syn.tags.indexOf('adj') !== -1){
        syn = new Word(syn.word);
        similarWords.adjectives.push(syn);
      } else if (syn.tags.indexOf('v') !== -1) {
        syn = new Word(syn.word);
        similarWords.verbs.push(syn);
      } else if (syn.tags.indexOf('n') !== -1) {
        syn = new Word(syn.word);
        similarWords.nouns.push(syn);
      }      
    }
  }
  fn(similarWords)
  })
}

function getMissingWords(Words, fn){
  console.log('words.len in line 144 is', Words.nouns.length)
  for (let i = 0; i < Words.nouns.length; i++) {
    console.log('i', i)
    let missingObj = _getAmountOfMissing(Words);
    _getSimilarWords(Words.nouns[i], 20, (result)=>{
      _joinWithoutDupes(Words, result);
      if(missingObj.total === 0) {
        setTimeout(()=>fn(Words), 1000);
        console.log('getMissingWords: Got \'nuff werds');
        return true;
      }
    })
  }
  console.log('getMissingWords: Din\'t get \'nuff werds omg wtf bbq');
  setTimeout(()=>fn(Words), 5000);
}

function _joinWithoutDupes(Words, toAdd) {
  allPos.forEach((pos) => {
    Words[pos] = Words[pos].concat(toAdd[pos]);
    for (let i = 0 ; i < Words[pos].length; i++){
      let check = Words[pos][i].word;
      for (let j = 0; j < Words[pos].length; j++){
        if (check === Words[pos][j].word && i !== j){
          Words[pos].splice(j,1);
        }
      }
    }
  })
}


module.exports = {
  init: init,
  _extractWords: _extractWords, 
  _getAmountOfMissing: _getAmountOfMissing,
  _getSimilarWords: _getSimilarWords,
  getMissingWords: getMissingWords,
  _joinWithoutDupes: _joinWithoutDupes,
}