const v = ['a','e','i','o','u'];
const c = ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z']


function makeIng(verb){
  var verbLength = verb.length;
  const letters = verb.substring(verb.length-3, verb.length);

  if ((c.indexOf(letters[0]) !== -1) && (v.indexOf(letters[1]) !== -1) && (c.indexOf(letters[2]) !== -1)){
    if(letters[2] === "w" || letters[2] === "y"){
      verb = verb + 'in\''
    } else {
      verb = verb + verb.substring(verb.length-1) + 'in\'';
    }
  }

  else {
    if (v.indexOf(letters[letters.length-1]) === -1){
      verb = verb + 'in\''
    } else {
      verb = verb.substring(0, verb.length-1) + 'in\'';
     
    }
  }
  return verb;
}

module.exports = makeIng