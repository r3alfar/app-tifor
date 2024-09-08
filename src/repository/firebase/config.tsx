import { initializeApp } from 'firebase/app';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = JSON.parse(import.meta.env.FIREBASE_CONFIG);
const app = initializeApp(firebaseConfig);