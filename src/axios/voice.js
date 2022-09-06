import axios from "axios";

const voice = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: "025f8fb3aecf48c0af78edbe7f8a95a9",
    "content-type": "application/json",
    "transfer-encoding": "chunked",
  },
});

export default voice;
