import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-uuI0s9jWAreGoEO00VZfp7WiVsRHK_0",
  authDomain: "vizsga-ed54c.firebaseapp.com",
  projectId: "vizsga-ed54c",
  storageBucket: "vizsga-ed54c.firebasestorage.app",
  messagingSenderId: "153181146843",
  appId: "1:153181146843:web:1ed439d2841cd36b9806fe",
  measurementId: "G-PCZHFYV15Q"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);