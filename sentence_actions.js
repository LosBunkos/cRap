var ext = require('./word-extractor');
// simple to ing
var toIng = require('./prog-verbs').makeIng;
// past to simple
const toSimple = require('verbutils')();
// simple to past
var toPast = require('tensify');
var POS = require('./parts_of_speech');

module.exports = {
  myNoun : (pronList, nounList, adjList = [""]) => {
    let pron = POS.randPron(pronList);
    let noun = POS.randFrom(nounList).word;
    if (adjList.length != 0) {
      noun = POS.randFrom(adjList).word + ' ' + noun;
    }
    return `${pron["my"]} ${noun}`
  },

  // I gots ghetto shit right here
  // PAV == Pronoun-auxiliary-verb
  IAuxVerb: function (pronList, verbList, changePronTo) {
    let pron = POS.randPron(pronList);
    let verb = POS.randFrom(verbList).word;
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
    
    if (pron.I === "it" && typeof changeItTo !== 'undefined'){
      return `${changeItTo} ${aux}`
    } else {
      return `${pron["I"]} ${aux}`;
    }
  }
}
