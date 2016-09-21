// simple to ing
const toIng = require('./prog-verbs');
// past to simple
const toSimple = require('verbutils')();
// simple to past
const toPast = require('tensify');
var ext = require('./word-extractor');
var q = require('q');


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
  let verb = randFrom(verbList);
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
  let noun = randFrom(nounList);
  if (adjList.length != 0) {
    noun = randFrom(adjList) + ' ' + noun;
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
  nouns: ["bitch", "snitch"],
  verbs: ["run", "tan", "cun"],
}

Words2 = {
  nouns: ["rhyme", "time", "thyme"],
  verbs: ["build", "yield"],
}

let adjs = [];
// console.log(simpleSentence(PronounsList, Words1.nouns, Words1.verbs, adjs));
// console.log(simpleSentence(PronounsList, Words2.nouns, Words2.verbs, adjs));
// console.log(simpleSentence(PronounsList, Words1.nouns, Words1.verbs, adjs));
// console.log(simpleSentence(PronounsList, Words2.nouns, Words2.verbs, adjs));


// test
////////////
let str = "If you have an author's name, but can't remember the title of the particular story\
 you are looking for, click on the above button to navigate to a page where you will be confronted\
  by a list of the authors whose works appear here.";
str = ext.init(str);
var Words;

// ext.getWordsAndRhymes(str, (werds)=> {
//   setTimeout(function(){
//     Words = werds;
//     console.log(Words)
//   }, 100)
// })

ext.extractForShortSentances(str, (werds) => {
  setTimeout(function(){
    Words = werds;
    console.log(werds)
  }, 100)
})
