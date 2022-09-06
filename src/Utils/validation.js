const checkLength = (string, lenght) => {
  return string.length > lenght;
};
const checkEqual = (string1, string2) => {
  return string1 == string2;
};

const checkEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const checkSocial = (str)=>{
  return str.match(/(http:\/\/|https:\/\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[‌•a-z]{3}\.([a-z]+)?\/.*/g)
}

export { checkLength, checkEqual,checkEmail ,checkSocial};
