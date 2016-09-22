// simple to ing
const toIng = require('./prog-verbs');
// past to simple
const toSimple = require('verbutils')();
// simple to past
const toPast = require('tensify');
var ext = require('./word-extractor');

const express = require('express');
const bodyParser = require('body-parser');
var morgan = require('morgan')

var app = express();

app.use(express.static('javascript'));
app.use(express.static('node_modules'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// log requests
app.use(morgan('combined'))

var port = process.env.PORT || '4000';

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

class Word {
  constructor(type) {
    this.type = type;
  }
}


// types:
// -verb:
// --simple
// --progressive
// --past
//-

// full list from https://english109mercy.wordpress.com/2012/10/22/23-auxiliary-verbs/
// removed from list: "being"
const AuxiliaryVerbs = {
  all: [
    "do", "does", "did", "has", "have", "had",
    "is", "am", "are", "was", "were", "be", "been",
    "may", "must", "might", "should", "could", "would", "shall", "will", "can"
  ],
  he: [
    "does", "did", "has", "had", "is", "was", "be", "been",
    "may", "must", "might", "should", "could", "would", "shall", "will", "can"
  ],

  I: [
    "do", "did", "have", "had", "am", "was", "be", "been",
    "may", "must", "might", "should", "could", "would", "shall", "will", "can" 
  ],

  we: [
    "do", "did", "have", "had", "are", "were", "be", "been",
    "may", "must", "might", "should", "could", "would", "shall", "will", "can"
  ],

  // allows neat object self-reference
  // http://stackoverflow.com/a/4616262/5660689
  get she () { return AuxiliaryVerbs.he },
  get it () { return AuxiliaryVerbs.he },
  get they () { return AuxiliaryVerbs.we },
  get you () { return AuxiliaryVerbs.we },
  get youSingular () { return AuxiliaryVerbs.we },
  get youPlural () { return AuxiliaryVerbs.we },
}

class PronounGroup {
  constructor(I, me, my, myself, him) {
    this.I = I;
    this.me = me;
    this.my = my;
    this.myself = myself;
    this.aux = AuxiliaryVerbs[this.I];
  }

  getRandomAuxiliary () {
    return this.aux[Math.floor(Math.random() * this.aux.length)];
  }
}

const Pronouns = {
  "I": new PronounGroup("I", "me", "my", "myself"),
  "it": new PronounGroup("it", "it", "its", "itself"),
  "he": new PronounGroup("he", "him", "his", "himself"),
  "we": new PronounGroup("we", "us", "our", "ourselves"),
  "she": new PronounGroup("she", "her", "her", "herself"),
  "they": new PronounGroup("they", "them", "their", "themselves"),
  "youPlural": new PronounGroup("you", "you", "your", "yourselves"),
  "youSingular": new PronounGroup("you", "you", "your", "yourself"),
}


const getRandom = (str) => {
  const list = [];
  if (str === "pronoun") {
    return Pronouns[PronounsList[randNum(PronounsList.length)]]
  } else {
    throw new Error(`No list found for "${str}"`);
  }
}


const sentence = {

}




// Below this line is just goofin' around
const PronounsList = [
  "I", "it", "he", "we", "she", "they", "youSingular", "youPlural"
];

let randNum = (upto)=> Math.floor(Math.random() * upto);
let randFrom = (list) => list[randNum(list.length)]
let randPron = (list = PronounsList)=> Pronouns[randFrom(list)];


  // I gots ghetto shit right here
  // PAV == Pronoun-auxiliary-verb
const IAuxVerb = (pronList, verbList, changePronTo) => {
  // if verb is past tense, make it present tense
  let pron = randPron(pronList);
  let verb = randFrom(verbList).word;
  // verb = toSimple.toBaseForm(verb);
  let aux = pron.getRandomAuxiliary();
  let l = console.log

  if (["do", "does", "been"].indexOf(aux) !== -1) {
    // l(1);
    aux = (["he", "she", "it"].indexOf(pron.I) === -1 ? verb : verb + 's');
  } else if (["are", "is", "am", "was", "were", "be"].indexOf(aux) !== -1) {
    // l(2)
    aux += ` ${toIng(verb)}`;
  } else if(["may", "must", "might", "should", "could", "would", "shall", "will", "can"].indexOf(aux) !== -1) {
    // l(3)
    aux += ` be ${toIng(verb)}`
  } else if (aux === "did") {
    // l(4)
    aux = `${toPast(verb).past}`
  } else {
    // l(5)
    aux += ` been ${toIng(verb)}`
  }
  
  if (pron.I === "it" && typeof changeItTo !== 'undefined'){
    return `${changeItTo} ${aux}`
  } else {
    return `${pron["I"]} ${aux}`;
  }
  
}

const myNoun = (pronList, nounList, adjList = [""]) => {
  let pron = randPron(pronList);
  let noun = randFrom(nounList).word;
  if (adjList.length != 0) {
    noun = randFrom(adjList).word + ' ' + noun;
  }
  return `${pron["my"]} ${noun}`
}

const simpleSentence = (pronList, nounList, verbList, adjList = [""]) => {
  let sentence = IAuxVerb(pronList, verbList, nounList) + ' ' +
                 myNoun(pronList, nounList, adjList);
  return sentence;
}
///////////////////////////////////


Words1 = {
  nouns: ["bitch", "snitch", "peach", "ditch", "rich"],
  verbs: ["run", "tan", "cun"],
}

Words2 = {
  nouns: ["rhyme", "time", "thyme", "slime", "dime"],
  verbs: ["build", "yield", "shield"],
}

let adjs = [];

// console.log(simpleSentence(PronounsList, Words1.nouns, Words1.verbs, adjs));
// console.log(simpleSentence(PronounsList, Words2.nouns, Words2.verbs, adjs));
// console.log(simpleSentence(PronounsList, Words1.nouns, Words1.verbs, adjs));
// console.log(simpleSentence(PronounsList, Words2.nouns, Words2.verbs, adjs));


// test
////////////
// let str = "In the beginning I humoured him, yes, that I can admit, but then a\
//  little voice in the back of my head began to whisper 'what if?' And that's when\
//   I started to over think the whole thing. I would have the opportunity to see him\
//    again. Maybe even follow and find him. Just go to the day before he left. \
//    That's all I would need. One last, long lingering look at his beautiful face so I \
//    could burn the image into my mind for good. I could even say goodbye. Hell, if I went \
//    back a week further I could stop the whole birthday incident. It almost felt unhealthy \
//    to even think these thoughts, but that didn't stop me. In fact I was beginning to feel \
//    something close to excitement. Like I was really going to get to see him again.";
// str = ext.init(str);

// ext.getWordsAndRhymes(str, (werds)=> {
//   setTimeout(function(){
//     Words = werds;
//     console.log(Words)
//   }, 100)
// })


var genSentence = (words, callback)=> {
  let nouns = words.nouns;
  let adjs = words.adjectives;
  let verbs = words.verbs;
  let all = '';
  // console.log(words.verbs)
  console.time("Got rhymes")
  let start = new Date().getTime();

  nouns[0].getRhymes(()=>{
    nouns[1].getRhymes(()=> {

      let sen1 = simpleSentence(PronounsList, [nouns[0]], verbs, adjs);
      let sen2 = simpleSentence(PronounsList, [nouns[1]], verbs, adjs);
      console.log('\n\t\t', nouns[0].rhymes, '\n');
      let sen3 = simpleSentence(PronounsList, nouns[0].rhymes, verbs, adjs);
      let sen4 = simpleSentence(PronounsList, nouns[1].rhymes, verbs, adjs);
      let sens = sen1 + '\n' + sen2 + '\n' + sen3 + '\n' + sen4;
      let end = new Date().getTime();
      let time = end - start;
      console.timeEnd("Got rhymes");
      callback({sentences: [sen1, sen2, sen3, sen4], took: time + 'ms'});

    })
  })
}

app.get('/getRap', (req, res, next) => {
  if (false){//!req.body || !req.body.text) {
    console.log('got a req with no req.body');
    next(new Error('f u no req.body'));
  }

    // console.log("Got text:", req.body.text)
    // let str2 = ext.init(req.body.text);
    console.log("\nTokenized to:", str)
    ext.getWordsAndRhymes(str, (werds) => {
      setTimeout(()=> {
        genSentence(werds, (sentences)=> {
          res.json(sentences);
          })
        }, 100);
    })
})

app.post('/getRap', (req, res, next) => {
  if (!req.body || !req.body.text) {
    console.log('got a req with no req.body');
    next('f u no req.body');
  }
    let str = req.body.text;
    console.log("\nGot text:\n\t", str);
    let tokens = ext.init(req.body.text);
    console.log("\nTokenized to:\n\t", tokens);
    ext.getWordsAndRhymes(tokens, (werds) => {
      setTimeout(()=> {
        genSentence(werds, (sentences)=> {
          sentences.tokens = tokens.split(' ');
          sentences.original = str;
          res.json(sentences);
          })
        }, 100);
    })


})

console.log('Running server on http://localhost:' + port);
app.listen(port);