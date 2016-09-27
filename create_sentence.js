const actions = require('./sentence_actions');
const POS = require('./parts_of_speech');
const we = require('./extractor');

class Sentence {
  constructor(text) {
    let words = text.split(' ');
    let lastWord = words.splice(words.length - 2, 2)[0];
    this.body = words.join(' ');
    this.lastWord = lastWord;
    this.rhymes = []
  }

  // this is a getter
  get text() {
    return `${this.body} ${this.lastWord}`
  }

  fillRhymes(fn = ()=>{}) {
    let self = this;
    let word = new we.Word(self.lastWord);
    word.getRhymes(()=> {
      self.rhymes = word.rhymes;
      fn()
    })
  }
}

class Sentencer {
  constructor(Words, ...args) {
    this.fns = args;
    this.source = Words;
  }

  make(Words = this.source) {
    let temp, output = '';
    this.fns.forEach((fn)=> {
      temp = fn(Words);
      if (!(typeof temp === 'undefined' || temp === null)) {
        output += `${temp} `;
        temp = null;
      }
    })
    return new Sentence(output);
  }

  rhyme(sentenceObj, Words = this.Words) {
    let self = this;
    let sen = self.make();
    sen.lastWord = POS.randFrom(sentenceObj.rhymes).word;
    return sen;
  }
}

exports.Sentencer = Sentencer;
exports.Sentence = Sentence;
