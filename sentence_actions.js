var ext = require('./word-extractor');
// simple to ing
var toIng = require('./prog-verbs').makeIng;
// past to simple
const toSimple = require('verbutils')();
// simple to past
var toPast = require('tensify');
var POS = require('./parts_of_speech');

let selectWordAndRemove = (list) => {
  // if(list.length == 0) {
  //   list.push({word: 'noun'})
  // }
  return list.splice(0,1)[0].word;
}

let aOrAn = (word) => {
  if (['a', 'e', 'i', 'o', 'u'].indexOf(word.charAt(0)) === -1) {
    aWord = `a ${word}`
  } else {
    aWord = `an ${word}`
  }
  return aWord;
}

module.exports = {
  pronDownWithNouns: (Words) => {
    let pron = POS.randPron();
    let noun = selectWordAndRemove(Words.nouns);
    let adj = selectWordAndRemove(Words.adjectives);    
    return `${pron.I} down with ${adj} ${noun}`
  },

  nounBetterHaveMyNoun: (Words) => {
    let noun = selectWordAndRemove(Words.nouns);
    let noun2 = selectWordAndRemove(Words.nouns);
    let adj = selectWordAndRemove(Words.adjectives);
    return `${noun} better have my ${adj} ${noun2}`
  },

  aintNoParty: (Words) => {
    let noun = selectWordAndRemove(Words.nouns);
    let verb = selectWordAndRemove(Words.verbs);
    return `ain't no party like ${aOrAn(noun)} party cuz ${aOrAn(noun)} party don't ${verb}`    
  },

  itAintNuthinButANounThang: (Words) => {
    let noun = selectWordAndRemove(Words.nouns);
    return `it ain't nuthin' but ${aOrAn(noun)} thang, baby`    
  },

  withMyNounOnMyNounAndViceVersa: (Words) => {
    let noun = selectWordAndRemove(Words.nouns);
    let noun2 = selectWordAndRemove(Words.nouns)
    return `with my ${noun} on my ${noun2} and my ${noun2} on my ${noun}`    
  },

  pronReachedFor: (Words) => {
    let noun = selectWordAndRemove(Words.nouns);
    let pron = POS.randPron();
    return `${pron.I} reached for`    
  },

  IDontVerbLikeThat: (Words) => {
    let pron = POS.randPron();
    let verb = selectWordAndRemove(Words.verbs);
    return `I don't ${verb} like that`    
  },

  suckasWannaVerb: (Words) => {
    let verb = selectWordAndRemove(Words.verbs);
    let noun = selectWordAndRemove(Words.nouns);
    return `suckas wanna ${verb}`    
  },

  whenISayVerbYouSayNoun: (Words) => {
    let verb = selectWordAndRemove(Words.verbs);
    let noun = selectWordAndRemove(Words.nouns);
    return `when I say ${verb}, you say ${noun}`    
  },

  cantBeNoNoun: (Words) => {
    let noun = selectWordAndRemove(Words.nouns);
    return `can't be no ${noun}`
  },

  rollingWith: (Words) => {
    let noun = selectWordAndRemove(Words.nouns);
    return `rollin' with`
  },

  dontYouVerb: (Words) => {
    let verb = selectWordAndRemove(Words.verbs);
    return `don't you ${verb}`;
  },
  
  yoMamaCanVerbMyAdjNoun: (Words) => {
    let verb = selectWordAndRemove(Words.verbs);
    let noun = selectWordAndRemove(Words.nouns);
    let adj = selectWordAndRemove(Words.adjectives);
    return `yo mama can ${verb} my ${adj} ${noun}`
  },

  IUsedToBeANoun: (Words) => {
    let pron = POS.randPron();
    let noun = selectWordAndRemove(Words.nouns);
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
    let noun = selectWordAndRemove(Words.nouns);
    let verb = selectWordAndRemove(Words.verbs);
    verb = (["he", "she", "it"].indexOf(pron.I) === -1 ? verb : verb + 's');
    return `${pron.I} ${verb} the ${noun}`
  },

  myNoun: (Words) => {
    let nounList = Words.nouns;
    let adjList = Words.adjectives;
    let pron = POS.randPron();
    let noun = selectWordAndRemove(Words.nouns);
    let adj = selectWordAndRemove(Words.adjectives);
    // add adjective
    return `${pron["my"]} ${adj} ${noun}`
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
