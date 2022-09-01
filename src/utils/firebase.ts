import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzAPEBDBRizK3T73NKY8rta7OhgVp3iUw",
  authDomain: "greenery-8647b.firebaseapp.com",
  projectId: "greenery-8647b",
  storageBucket: "greenery-8647b.appspot.com",
  messagingSenderId: "460789801269",
  appId: "1:460789801269:web:251f13169aa8a314d52c7c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const users = collection(db, "users");
const cards = collection(db, "cards");
const posts = collection(db, "posts");
const species = collection(db, "species");
const chatrooms = collection(db, "chatrooms");

interface UserData {
  userId: string;
  userName: string;
  email: string;
  photoUrl: string;
  gallery: string[];
  followList: string[];
  favoritePlants: string[];
  favoritePosts: string[];
}
interface PlantCardData {
  cardId: string;
  ownerId: string;
  plantName: string;
  species: string;
}
export async function addANewUser(data: UserData) {
  try {
    const user = doc(users);
    await setDoc(user, data);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
export async function addANewPlantCard(data: PlantCardData) {
  try {
    const plantCard = doc(cards);
    await setDoc(plantCard, data);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
export async function getUserData(userId: string) {
  const q = query(users, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    alert("User not existed!");
    return;
  }
  querySnapshot.forEach((doc) => {
    return doc.data();
  });
}

//Delete

//subcollection
