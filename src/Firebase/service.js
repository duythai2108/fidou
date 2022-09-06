import { async } from "@firebase/util";
import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "./config";

const uploadFile = async (file, name, type) => {
  // Base64url formatted string
  const storageRef = ref(storage, name);
  const uploadTask = uploadBytesResumable(storageRef, file);
  const metadata = {
    contentType: type,
  };
  let url = "";
  await uploadBytes(storageRef, file, metadata).then(async (snapshot) => {
    await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      url = downloadURL;
    });
  });
  return url;
};

export { uploadFile };
