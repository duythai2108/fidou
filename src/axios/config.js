import axios from "axios";

const config = {
  baseURL: "https://voiceapi.herokuapp.com",
};
const myAxios = axios.create(config);
export default myAxios;
