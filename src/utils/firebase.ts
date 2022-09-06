import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAlAkEJTyA258YArFAKWH-aN1ynIGmYqYc",
  authDomain: "greenery-797bb.firebaseapp.com",
  projectId: "greenery-797bb",
  storageBucket: "greenery-797bb.appspot.com",
  messagingSenderId: "756191479369",
  appId: "1:756191479369:web:3147acb81630379a626198",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const users = collection(db, "users");
const cards = collection(db, "cards");
const posts = collection(db, "posts");
const species = collection(db, "species");
const chatrooms = collection(db, "chatrooms");
const diaries = collection(db, "diaries");

export { app, db, storage, users, cards, posts, species, chatrooms, diaries };
