var ext = require('./word-extractor');
var morgan = require('morgan')

// simple to ing
const toIng = require('./prog-verbs');
// past to simple
const toSimple = require('verbutils')();
// simple to past
const toPast = require('tensify');

// full list from:
// https://english109mercy.wordpress.com/2012/10/22/23-auxiliary-verbs/
// removed from list: "being"
exports.AuxiliaryVerbs = {
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
  get she () { return exports.AuxiliaryVerbs.he },
  get it () { return exports.AuxiliaryVerbs.he },
  get they () { return exports.AuxiliaryVerbs.we },
  get you () { return exports.AuxiliaryVerbs.we },
  get youSingular () { return exports.AuxiliaryVerbs.we },
  get youPlural () { return exports.AuxiliaryVerbs.we },
}

exports.PronounGroup = class {
  constructor(I, me, my, myself, him) {
    this.I = I;
    this.me = me;
    this.my = my;
    this.myself = myself;
    this.aux = exports.AuxiliaryVerbs[this.I];
  }

  getRandomAuxiliary () {
    return this.aux[Math.floor(Math.random() * this.aux.length)];
  }
},

exports.Pronouns = {
  "I": new exports.PronounGroup("I", "me", "my", "myself"),
  "it": new exports.PronounGroup("it", "it", "its", "itself"),
  "he": new exports.PronounGroup("he", "him", "his", "himself"),
  "we": new exports.PronounGroup("we", "us", "our", "ourselves"),
  "she": new exports.PronounGroup("she", "her", "her", "herself"),
  "they": new exports.PronounGroup("they", "them", "their", "themselves"),
  "youPlural": new exports.PronounGroup("you", "you", "your", "yourselves"),
  "youSingular": new exports.PronounGroup("you", "you", "your", "yourself"),
}


// For Randomizing shiet
exports.PronounsList = [
  "I", "it", "he", "we", "she", "they", "youSingular", "youPlural"
]

// Randomizers
exports.randNum = (upto)=> Math.floor(Math.random() * upto);
exports.randFrom = (list)=> list[this.randNum(list.length)];
exports.randPron = (list = this.PronounsList)=> this.Pronouns[this.randFrom(list)];



