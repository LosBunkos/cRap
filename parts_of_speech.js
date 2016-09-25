var sentencer = require('sentencer');
var ext = require('./word-extractor');
var morgan = require('morgan')
const express = require('express');
var app = express();
const bodyParser = require('body-parser');
// simple to ing
const toIng = require('./prog-verbs');
// past to simple
const toSimple = require('verbutils')();
// simple to past
const toPast = require('tensify');


app.use(express.static(`${__dirname}/node_modules`));
app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// log requests
app.use(morgan('combined'))

var port = process.env.PORT || '4000';

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
}); 

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

/////////////////////////////////////////////////
// Move everything below this line to router.js//
/////////////////////////////////////////////////

app.get('/getRap', (req, res, next) => {
  if (false){//!req.body || !req.body.text) {
    console.log('got a req with no req.body');
    next(new Error('f u no req.body'));
  }

    // console.log("Got text:", req.body.text)
    // let str2 = ext.init(req.body.text);
    console.log("\nTokenized to:", str)
    ext.getWordsAndRhymes(str, (werds) => {
      // setTimeout(()=> {
        genSentence(werds, (sentences)=> {
          res.json(sentences);
          })
        // }, 0);
    })
})

app.post('/getRap', (req, res, next) => {
  if (!req.body || !req.body.text) {
    console.log('got a req with no req.body');
    next('f u no req.body');
  }
    console.log('=====req start=====');
    let str = req.body.text;
    console.log("Got text:\n  ", str);
    let tokens = ext.init(req.body.text);
    console.log("\nTokenized to:\n ", tokens);
    ext.getWordsAndRhymes(tokens, (werds) => {
      // setTimeout(()=> {
        genSentence(werds, (sentences)=> {
          sentences.tokens = tokens.split(' ');
          console.log(`\ngenerated:\n`, ...sentences.sentences);
          console.log('=====req end=====\n\nFrom:');
          sentences.original = str;
          res.json(sentences);
          })
        // }, 100);
    })


})

// app.get('/', function(req, res){
//   res.sendFile(__dirname + "/public/index.html");
// });


console.log('Running server on http://localhost:' + port);
app.listen(port);