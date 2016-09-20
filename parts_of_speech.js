// full list from https://english109mercy.wordpress.com/2012/10/22/23-auxiliary-verbs/
// removed from list: "being"

const singularAuxiliaryVerbs = {
  all: [
    "do", "does", "did", "has", "have", "had",
    "is", "am", "are", "was", "were", "be", "been",
    "may", "must", "might", "should", "could", "would", "shall", "will", "can"
  ],
  he: [
    "does", "did", "has", "had", "is", "was", "be", "been",
    "may", "must", "might", "should", "could", "would", "shall", "will", "can"
  ],

  // allows neat object self-reference
  get she () { return singularAuxiliaryVerbs.he },
  get it () { return singularAuxiliaryVerbs.he },

  i: [
    "do", "did", "have", "had", "am", "was", "be", "been",
    "may", "must", "might", "should", "could", "would", "shall", "will", "can" 
  ],
  you: [
    "do", "did", "have", "had", "are", "were", "be", "been", "may", 
    "must", "might", "should", "could", "would", "shall", "will", "can"
  ]
}

const pluralAuxiliaryVerbs = {
  all: [
    "do", "does", "did", "has", "have", "had",
    "is", "am", "are", "was", "were", "be", "been",
    "may", "must", "might", "should", "could", "would", "shall", "will", "can"
  ],
  we: [
    "do", "did", "have", "had", "are", "were", "be", "been",
    "may", "must", "might", "should", "could", "would", "shall", "will", "can"
  ],
  // allows neat object self-reference
  get they () { return pluralAuxiliaryVerbs.we },
  get you () { return pluralAuxiliaryVerbs.we },
}

class PronounGroup {
  constructor(I, me, my, myself) {
    this.I = I;
    this.me = me;
    this.my = my;
    this.myself = myself;
  }
}

const singular_pronouns = [
  new PronounGroup("I", "me", "my", "myself"),
  new PronounGroup("you", "you", "your", "yourself"),
  new PronounGroup("it", "it", "its", "itself"),
  new PronounGroup("he", "him", "his", "himself"),
  new PronounGroup("she", "her", "hers", "herself"),
  new PronounGroup("they", "them", "their", "themselves"),
]

const plural_pronouns = [
  new PronounGroup("we", "us", "ours", "ourselves"),
  new PronounGroup("they", "them", "their", "themselves"),
  new PronounGroup("you", "you", "your", "yourselves")
]

let randNum = (upto)=> Math.floor(Math.random() * upto);

