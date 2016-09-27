const we = require('./extractor');

let str = "before ever the burgesses forbade the killing killing of cats, there dwelt an old cotter and his wife who delighted to trap and slay the cats of their neighbors. Why they did this I know not; save that many hate the voice of the cat in the night, and take it ill that cats should run stealthily about yards and gardens at twilight";

str = we.init(str);

we._extractWords(str, (Words)=> {
  // console.log(Words, "this is from app.js");
  // console.log('missing', we._getAmountOfMissing(Words));
  // we._getSimilarWords(Words.nouns[0].word, 50, (result) => {
  // })
  let missing = we._getAmountOfMissing(Words);
  we.getMissingWords(Words, (res)=> {
      console.log(res);
    })
})
