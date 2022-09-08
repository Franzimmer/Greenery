import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  CollectionReference,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { PlantCard } from "../types/plantCardType";
import { UserInfo } from "../types/userInfoType";

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
const users = collection(db, "users") as CollectionReference<UserInfo>;
const cards = collection(db, "cards");
const posts = collection(db, "posts");
const species = collection(db, "species");
const chatrooms = collection(db, "chatrooms");
const diaries = collection(db, "diaries");

const firebase = {
  async updateUserPhoto(id: string, url: string) {
    let docRef = doc(users, id);
    await updateDoc(docRef, { photoUrl: url });
  },
  async updateUserName(id: string, name: string) {
    let docRef = doc(users, id);
    await updateDoc(docRef, { userName: name });
  },
};

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
  firebase,
};
