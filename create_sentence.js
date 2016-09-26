const actions = require('./sentencer_actions');
const pos = require('./parts_of_speech');
const ext = require('./word-extractor');
// simple to ing
const toIng = require('./prog-verbs');
// past to simple
const toSimple = require('verbutils')();
// simple to past
const toPast = require('tensify');

class Sentence {
  constructor(...args) {
    this.fns = args;
  }

  make(Words) {
    let temp, output = '';
    this.fns.forEach((fn)=> {
      temp = fn(Words);
      if (!(typeof temp === 'undefined' || temp === null)) {
        output += `${temp} `;
        temp = null;
      }
    })
    return output;
  }
}

exports.Sentence = Sentence;
