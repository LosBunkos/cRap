const cs = require('./create_sentence');
const sa = require('./sentence_actions');

exports.init = (Words)=> {
  return {
    AintNo: new cs.Sentencer(Words, sa.aintNoParty),
    NounOnMyNoun: new cs.Sentencer(Words, sa.withMyNounOnMyNounAndViceVersa),
    DontUVerbMyNoun: new cs.Sentencer(Words, sa.dontYouVerb, sa.myNoun),
    yoMama: new cs.Sentencer(Words, sa.yoMamaCanVerbMyAdjNoun),
    cantBeNoNoun: new cs.Sentencer(Words, sa.cantBeNoNoun, ()=>"on", sa.myNoun),
    myNounIsLikeMyNoun: new cs.Sentencer(Words, sa.myNoun, ()=>"is like", sa.myNoun),
    IReachedForMyNoun: new cs.Sentencer(Words, sa.pronReachedFor, sa.myNoun),
  }
};
