import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCzAPEBDBRizK3T73NKY8rta7OhgVp3iUw",
  authDomain: "greenery-8647b.firebaseapp.com",
  projectId: "greenery-8647b",
  storageBucket: "greenery-8647b.appspot.com",
  messagingSenderId: "460789801269",
  appId: "1:460789801269:web:251f13169aa8a314d52c7c",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const users = collection(db, "users");
export const cards = collection(db, "cards");
export const posts = collection(db, "posts");
export const species = collection(db, "species");
export const chatrooms = collection(db, "chatrooms");

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
