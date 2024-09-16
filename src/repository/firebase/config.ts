import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
// // // TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);

export const firebaseAppInitialize = () => {
  initializeApp(firebaseConfig);
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// if (firebaseConfig) {
//   console.log("firebase config loaded");
//   initializeApp(firebaseConfig);
// } else {
//   console.log("firebase config not loaded");
// }
