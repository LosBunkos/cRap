// they because they *have*
// followd 

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