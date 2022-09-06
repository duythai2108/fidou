const notAllowNumRegExp = /^([^0-9]*)$/
const numRegExp = /^([0-9]*)$/
const notSpecialRegExp = /^[^*|\\":<>[\]{}`\\()';@&$!#%^//=_~?+-]+$/
const passUpperRegExp = /^.*[A-Z].*$/
const passLowerRegExp = /^.*[a-z].*$/
const passDigitSpecialRegExp = /^(?=.*?[0-9])|(?=.*?\W).*$/
const passOneDigitRegExp = /\d/
const passWebsiteRegExp =
  /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/
export {
  notSpecialRegExp,
  notAllowNumRegExp,
  numRegExp,
  passUpperRegExp,
  passLowerRegExp,
  passDigitSpecialRegExp,
  passOneDigitRegExp,
  passWebsiteRegExp
}
