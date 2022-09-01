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
  Timestamp,
  arrayUnion,
  FieldValue,
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
interface Activity {
  plantId: string;
  time: number;
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
//Delete document will not delete its subcollection

//subcollection
export async function getUserActivities(userId: string) {
  const activitiesRef = collection(db, "users", userId, "activities");
  const querySnapshot = await getDocs(activitiesRef);
  console.log(querySnapshot);
  if (querySnapshot.empty) {
    alert("User not existed!");
    return;
  }
  querySnapshot.forEach((doc) => {
    return doc.data();
  });
}

export async function addUserWateringActivity(userId: string, data: Activity) {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");
  const activityDate = `${today.getFullYear()}-${month}-${date}`;
  const activityRef = doc(db, "users", userId, "activities", activityDate);
  await setDoc(activityRef, {
    watering: arrayUnion(data),
  });
}
