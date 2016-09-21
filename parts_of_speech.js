// simple to ing
const toIng = require('./prog-verbs');
// past to simple
const toSimple = require('verbutils')();
// simple to past
const toPast = require('tensify');

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
let randPron = ()=> Pronouns[PronounsList[randNum(PronounsList.length)]];

let nouns = ['potatoes', 'basketball', 'stabbing knife', "elbows"];
let adjs = ["amazing", 'dirty', 'funky', 'brownish-red'];

  // I gots ghetto shit right here
  // PAV == Pronoun-auxiliary-verb
  const genPAV = (pron, verb, changeItTo = "it")=> {
    // if verb is past tense, make it present tense
    verb = toSimple.toBaseForm(verb);
    originalPronI = pron.I;
    pron.I = (pron.I === 'it') ? changeItTo : pron.I

    let aux = pron.getRandomAuxiliary();
    if (["do", "does", "been"].indexOf(aux) !== -1) {
      aux = (["he", "she", "it"].indexOf(pron.I) === -1 ? verb : verb + 's');
    } else if (["are", "is", "am", "was", "were", "be"].indexOf(aux) !== -1) {
      aux += ` ${toIng(verb)}`;
    } else if(["may", "must", "might", "should", "could", "would", "shall", "will", "can"].indexOf(aux) !== -1) {
      aux += ` be ${toIng(verb)}`
    } else if (aux === "did") {
      aux = ` ${toPast(verb)}`
    } else {
      aux += ` been ${toIng(verb)}`
    }
    let toReturn = pron.I;
    pron.I = originalPronI;
    return `${toReturn} ${aux}`;
    
  }
///////////////////////////////////

console.log(genPAV(randPron(), 'played', 'nigguz'));


