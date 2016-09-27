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
      //start at i=5 because first words suck
      let length = JSON.parse(body).length

      for (let i = length-1; i > length-5; i--) {
        let rhyme = JSON.parse(body)[i].word;
        rhyme = new Word(rhyme)
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
  request('https://api.datamuse.com/words?ml=' + word.word + '&max=' + count, function(err, res, body){
    console.log('request')

  for (let i = 0 ; i < count ; i++){
    //if the res empty - return
    if (body.length === 2 ) {
      return false;
    }
    let syn = JSON.parse(body)[i];

    if (typeof syn.tags !== 'undefined' && syn.tags.indexOf('v') > -1) {
       syn = new Word(syn.word);
       similarWords.verbs.push(syn);
    }
    if (typeof syn.tags !== 'undefined' && syn.tags.indexOf('adj') > -1){
       syn = new Word(syn.word);
       similarWords.adjectives.push(syn);  
    }
    if (typeof syn.tags !== 'undefined' && syn.tags.indexOf('n') > -1) {
       syn = new Word(syn.word);
       similarWords.nouns.push(syn);
     }     
   } 
  // setTimeout(()=>fn(similarWords), 0);
  fn(similarWords);
  })
}

function getMissingWords(Words, fn){
  let missingObj = _getAmountOfMissing(Words);
  console.log('words.len in line 144 is', Words.nouns.length)
  for (let i = 0; i < Words.nouns.length && i < 3; i++) {
    console.log('i', i)
    _getSimilarWords(Words.nouns[i].word, 40, (result)=> {
      Words = _joinWithoutDupes(Words, result);
      missingObj = _getAmountOfMissing(Words);
      // if(missingObj.total === 0) {
      //   console.log('getMissingWords: Got \'nuff werds');
      //   setTimeout(()=>fn(Words), 1500);
      //   return true;
      // }
    })
  }
  setTimeout(()=>{
    console.log('getMissingWords: Din\'t get \'nuff werds omg wtf bbq');
    fn(Words)
    return;
  }, 1500);
}

function _joinWithoutDupes(Words, toAdd) {
  allPos.forEach((pos)=> {
    toAdd[pos].forEach((wordToAdd)=> {
      // console.log('\n------------\n', Words)
      if (idxInArr(wordToAdd, Words[pos]) === -1) {
        Words[pos].push(wordToAdd)
      }
    })
  })
  return Words;
}

function idxInArr(word, wordArr) {
  for (let i = 0; i < wordArr.length; i++) {
    if (word.word === wordArr[i].word) {
      return i;
    }
  }
  return -1;
}

module.exports = {
  init: init,
  _extractWords: _extractWords, 
  _getAmountOfMissing: _getAmountOfMissing,
  _getSimilarWords: _getSimilarWords,
  getMissingWords: getMissingWords,
  _joinWithoutDupes: _joinWithoutDupes,
  Word: Word
}