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

let str = "There are predictions that Monday night’s presidential debate will shatter records,\
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



getWordsAndRhymes(str,fn)

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

    //don't forget synamount
    setTimeout(function(){
      if (Words.nouns.length < wordAmount){
        let synamount = wordAmount - Words.nouns.length;
        console.log("missing nouns",synamount)
      }   
      if (Words.adjectives.length < wordAmount){
        let synamount = wordAmount - Words.adjectives.length;
        console.log("missing adjs",synamount)
        for (i = 0 ; i < Words.adjectives.length ; i++){
          console.log(Words.adjectives[i])
          console.log(i)
          // getSyns(Words.adjectives[i])
        }

      }  
      if (Words.verbs.length < wordAmount){
        let synamount = wordAmount - Words.verbs.length;
        console.log("missing verbs",synamount)
      }               
    }, 50)
  })
}

function getSyns(word, Words, synamount, fn) {
  let that = this;
  that.syns =[];
  request('https://api.datamuse.com/words?rel_syn='+that.word+'&max=1', function(err, res, body){
    // console.log(searchWord)
    for(let i = 0; i < 3; i++){
      let syn = JSON.parse(body)[i];
      if (typeof syn !== 'undefined'){
        that.syns.push(syn);
      }
    }
  this.syns = that.syns;
  fn();
  })
}

//   let words = [str].join(" ").split(" ");
//   setTimeout(()=> {
//   for (let i = 0; i < words.length ; i++){
//     wordpos.getPOS(words[i], function(result) {
//       let word = result.rest.toString();
//       if (word.length > 0){ 
//         let input = new Word(word, "name");
//         Words.rest.push(input);
//       }
//     })
//   }
//   fn(Words);
// }, 20)



//for short inputs get the words and then find 2 synonyms for each
// function extractForShortSentances(str, fn) {

//   const Words = {
//   nouns: [],
//   adjectives: [],
//   verbs: [],
//   rest: []
//   }

//   wordpos.getPOS(str, function(result){
//     nouns = result.nouns;
//     verbs = result.verbs;
//     adjectives = result.adjectives;
//     rest = result.rest;

//     for(n in nouns){
//       let word = new Word(nouns[n], "noun");
//       word.getSyns(()=> {
//         Words.nouns.push(word);
//       });
//     }
//     for(v in verbs){
//       let word = new Word(verbs[v], "verb");
//       word.getSyns(()=> {
//         Words.verbs.push(word);
//       });
//     }
//     for(a in adjectives){
//       let word = new Word(adjectives[a], "adjective");
//       word.getSyns(()=> {
//         Words.adjectives.push(word);

//       });
//     }

//     // setTimeout(() => {
//     for(n in rest){
//       let word = new Word(rest[n], "rest");
//       word.getSyns(()=> {
//         Words.rest.push(word);
//         fn(Words)  
//       });
//     }
//   // }, 0)
  
//   })
// }

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








