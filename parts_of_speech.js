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

// Below this line is just goofin' around
const PronounsList = [
  "I", "it", "he", "we", "she", "they", "youSingular"
];

let randNum = (upto)=> Math.floor(Math.random() * upto);
let randPron = ()=> Pronouns[PronounsList[randNum(PronounsList.length)]];

let nouns = ['potatoes', 'basketball', 'stabbing knife', "elbows"];
let adjs = ["amazing", 'dirty', 'funky', 'brownish-red'];

for(var i = 0; i < 10; i++) {
  let pron1 = randPron();
  let pron2 = randPron();
  let pron3 = randPron();
  let noun1 = nouns[randNum(nouns.length)];
  let adj1 = adjs[randNum(adjs.length)];

  // I gots ghetto shit right here
  let aux1 = pron1.getRandomAuxiliary();
  if (["do", "does", "been"].indexOf(aux1) !== -1) {
    aux1 = (["he", "she", "it"].indexOf(pron1.I) === -1 ? "play" : "plays");
  } else if (["are", "is", "am", "was", "were", "be"].indexOf(aux1) !== -1) {
    aux1 += " playing";
  } else if(["may", "must", "might", "should", "could", "would", "shall", "will", "can"].indexOf(aux1) !== -1) {
    aux1 += " be playing"
  } else if (aux1 === "did") {
    aux1 = "played"
  } else {
    aux1 += " been playing"
  }
  // console.log('\n\t', pron1)
  console.log(pron1.I, aux1, "with", pron2.my, adj1, noun1);
}


