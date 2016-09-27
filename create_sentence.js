const actions = require('./sentence_actions');
const POS = require('./parts_of_speech');
const we = require('./extractor');

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

  rhyme(Words, string) {
    let self = this;
    let word = string
      .split(' ')
      .splice(string.length - 2, 1);
    console.log('word was', word)
    word = new we.Word(word);
    console.log('word is now', word)
    word.getRhymes(()=> {
      let sentence = self.make(Words);
      return sentence
        .split(' ')
        .splice(sentence.length - 2, 1, POS.randFrom(word.rhymes))
        .join(' ');
    })
  }
}

exports.Sentence = Sentence;
