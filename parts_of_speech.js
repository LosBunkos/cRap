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
  new PronounGroup("he", "him", "his", "himself"),
  new PronounGroup("she", "her", "hers", "herself"),
  new PronounGroup("they", "them", "their", "themselves")
  ]