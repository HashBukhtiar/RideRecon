import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";

export const uploadImageToFirebase = async (image: {
  uri: string;
  fileName?: string;
  mimeType?: string;
}): Promise<string> => {
  // grab sthe local image file and convert it to a blob so firebase can handle (local uri)
  const response = await fetch(image.uri);
  const blob = await response.blob();

  // get the file name or set it to photo.jpg
  const fileName = image.fileName || "photo.jpg";
  const storageRef = ref(storage, `uploads/${fileName}`);

  // upload the image to firebase storage
  const result = await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(result.ref);

  // return the download url (maybe used in car collections later?)
  return downloadURL;
};
