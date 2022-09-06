const notAllowNumRegExp = /^([^0-9]*)$/
const numRegExp = /^([0-9]*)$/
const notSpecialRegExp = /^[^*|\\":<>[\]{}`\\()';@&$!#%^//=_~?+-]+$/
const passUpperRegExp = /^.*[A-Z].*$/
const passLowerRegExp = /^.*[a-z].*$/
const passDigitSpecialRegExp = /^(?=.*?[0-9])|(?=.*?\W).*$/
const passOneDigitRegExp = /\d/

export {
  notSpecialRegExp,
  notAllowNumRegExp,
  numRegExp,
  passUpperRegExp,
  passLowerRegExp,
  passDigitSpecialRegExp,
  passOneDigitRegExp
}
