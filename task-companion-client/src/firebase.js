import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwrxkuB6JafN62lmjmK7zqoNyvyH8-CUY",
  authDomain: "task-companion-833f9.firebaseapp.com",
  databaseURL: "https://task-companion-833f9-default-rtdb.firebaseio.com",
  projectId: "task-companion-833f9",
  storageBucket: "task-companion-833f9.firebasestorage.app",
  messagingSenderId: "444494405481",
  appId: "1:444494405481:web:d76bf5ce3ba0d56d40e7f8"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };