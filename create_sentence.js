const actions = require('./sentence_actions');
const POS = require('./parts_of_speech');

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
