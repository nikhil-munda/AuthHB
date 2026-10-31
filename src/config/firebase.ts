
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVgZmiCW6g6la7SzV3vE_2mqpQIIOzmzI",
  authDomain: "authhb.firebaseapp.com",
  projectId: "authhb",
  storageBucket: "authhb.firebasestorage.app",
  messagingSenderId: "767821176677",
  appId: "1:767821176677:web:6352faafafc5df17cb4b8c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

