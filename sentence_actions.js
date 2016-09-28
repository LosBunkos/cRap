var ext = require('./word-extractor');
// simple to ing
var toIng = require('./prog-verbs').makeIng;
// past to simple
const toSimple = require('verbutils')();
// simple to past
var toPast = require('tensify');
var POS = require('./parts_of_speech');

module.exports = {
  IUsedToBeANoun: (Words) => {
    let pron = POS.randPron();
    let noun = POS.randFrom(Words.nouns).word;
    let aNoun;
    if (['a', 'e', 'i', 'o', 'u'].indexOf(noun.charAt(0)) === -1) {
      aNoun = `a ${noun}`
    } else {
      aNoun = `an ${noun}`
    }
    return `${pron.I} used to be ${aNoun}`;
  },

  IVerbTheNoun: (Words) => {
    let pron = POS.randPron();
    let noun = POS.randFrom(Words.nouns).word;
    let verb = POS.randFrom(Words.verbs).word;
    return `${pron.I} ${verb} the ${noun}`
  },

  myNoun: (Words) => {
    let nounList = Words.nouns;
    let adjList = Words.adjectives;
    let pron = POS.randPron();
    let noun = Words.nouns.splice(0,1)[0].word;
    let adj = Words.adjectives.splice(0,1)[0].word;
    // add adjective
    noun = adj + ' ' + noun;
    return `${pron["my"]} ${noun}`
  },

  // I gots ghetto shit right here
  IAuxVerb: function (Words) {
    const nounList = Words.list;
    const verbList = Words.verbs;
    let verb = Words.verbs.splice(0,1)[0].word;
    let pron = POS.randPron();
    let aux = pron.getRandomAuxiliary();
    // lol
    let l = console.log;

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
    
    // if (pron.I === "it" && typeof changeItTo !== 'undefined'){
    //   return `${changeItTo} ${aux}`
    // } 
    // else {
      return `${pron["I"]} ${aux}`;
    // }
  }
}
