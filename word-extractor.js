const WordPOS = require('wordpos'),
    wordpos = new WordPOS();
const request = require('request');
const stopwords = require('stopwords').english;
const toSimple = require('verbutils')();


const allPos = ["nouns", "verbs", "adjectives"];
const typeFromArrName = (arr)=> arr.substr(0, arr.length - 1);
// the stopwords list
const stopWords = stopwords.toString();


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

//get words and request rhymes
function getWordsFromTokens(str, fn){
  //this is for checking if there are enough words after getting them all into the words obj
  const wordAmount = 10;

  const Words = {
    nouns: [],
    adjectives: [],
    verbs: [],
    rest: []
  }

  // get the words
  wordpos.getPOS(str, function(result){
    let rest = result.rest;
    
    allPos.forEach((pos)=> {
      // "nouns" --> "noun"
      let type = typeFromArrName(pos);
      for(i in result[pos]){
        let word = new Word(result[pos][i].toLowerCase(), type);
        Words[pos].push(word);
      }
    })

    // anything that wasn't categorized into a pos, 
    // make it present simple and check if a verb
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


// check how many words are missing in every pos for 10 and get syns
function howManyWordsMissing(Words){  
  let neededAmount = 10;

// for each allPos do this kaki
  allPos.forEach((pos)=> {
    if (Words[pos].length <= neededAmount){
      let missing = neededAmount - Words[pos].length;
      let getPerWord = Math.round(missing / Words[pos].length);
      let getFirst = (missing % Words[pos].length) + getPerWord;

      if (getFirst !== 0){
      getSyns(Words[pos][0].word, Words, getFirst)
      }

      for (let i = 1; i < Words[pos].length; i++){     
        if (getPerWord === 0) {
          break;
        }
        getSyns(Words[pos][i].word, Words, getPerWord)
      }
    }
  })
}


//this function checks the syns coming back and shoves them where they need to go
function checkType(synArr, Words){
  var check = synArr.toString();
  wordpos.getPOS(check, function(result){
    allPos.forEach((pos)=> {
      let type = typeFromArrName(pos);
      let count = result[pos].length;
      if(count > 0){
        for (let i = 0; i < count; i++){
          let word = result[pos][i];
          word = new Word(word, type);
          Words[pos].push(word);
        }
      }
    })

    allPos.forEach((pos)=> {
      if(Words[pos].length > 10) {
        Words[pos] = Words[pos].splice(0, 10);
      }
    })
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
      if(typeof syn !== 'undefined' && checkIfExists(syn, Words) ||  syn.word.includes(" ")) {
            synArr.push(syn.word)
      }
    }
    fn();
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
class Word {
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

module.exports = {
  init: init,
  getWordsFromTokens: getWordsFromTokens, 
  Word: Word,
  getSyns: getSyns
}








