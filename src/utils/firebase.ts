import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzAPEBDBRizK3T73NKY8rta7OhgVp3iUw",
  authDomain: "greenery-8647b.firebaseapp.com",
  projectId: "greenery-8647b",
  storageBucket: "greenery-8647b.appspot.com",
  messagingSenderId: "460789801269",
  appId: "1:460789801269:web:251f13169aa8a314d52c7c",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth();
const db = getFirestore(app);
const users = collection(db, "users");
const cards = collection(db, "cards");
const posts = collection(db, "posts");
const species = collection(db, "species");
const chatrooms = collection(db, "chatrooms");
const diaries = collection(db, "diaries");

export {
  app,
  db,
  storage,
  auth,
  users,
  cards,
  posts,
  species,
  chatrooms,
  diaries,
};
