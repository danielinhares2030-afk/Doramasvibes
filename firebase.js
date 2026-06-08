import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnPYkYXY0EAF39BqTBYcbI-tLfDzUKyjY",
  authDomain: "doramasvibe-188b8.firebaseapp.com",
  projectId: "doramasvibe-188b8",
  storageBucket: "doramasvibe-188b8.firebasestorage.app",
  messagingSenderId: "388746690328",
  appId: "1:388746690328:web:91e308a673c88d38d9286d",
  measurementId: "G-6YSB91KZ2J"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
