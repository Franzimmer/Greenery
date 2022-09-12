import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  CollectionReference,
  doc,
  addDoc,
  getDoc,
  getDocs,
  where,
  updateDoc,
  deleteDoc,
  query,
  setDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { PlantCard } from "../types/plantCardType";
import { UserInfo } from "../types/userInfoType";
import { message } from "../components/Chatroom/Chatroom";
import { Comment, Post } from "../pages/Forum/ForumPost";

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
const posts = collection(db, "posts") as CollectionReference<Post>;
const species = collection(db, "species");
const chatrooms = collection(db, "chatrooms");
const diaries = collection(db, "diaries");

const firebase = {
  async getUserInfo(id: string) {
    let docRef = doc(users, id);
    let docSnapshot = await getDoc(docRef);
    return docSnapshot;
  },
  async updateUserPhoto(id: string, url: string) {
    let docRef = doc(users, id);
    await updateDoc(docRef, { photoUrl: url });
  },
  async updateUserName(id: string, name: string) {
    let docRef = doc(users, id);
    await updateDoc(docRef, { userName: name });
  },
  async storeChatroomData(users: string[], msg: message) {
    let usersCopy = [...users];
    const q = query(
      chatrooms,
      where("users", "in", [users, usersCopy.reverse()])
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      let room = doc(chatrooms);
      await setDoc(room, { users: users, msgs: [msg] });
    } else {
      querySnapshot.forEach(async (docData) => {
        let docRef = doc(chatrooms, docData.id);
        let docMsgs = docData.data().msgs;
        await updateDoc(docRef, { msgs: [...docMsgs, msg] });
      });
    }
  },
  async changePlantOwner(cardId: string, newOwnerId: string) {
    let docRef = doc(cards, cardId);
    await updateDoc(docRef, { ownerId: newOwnerId });
  },
  async addPost(postData: {
    title: string;
    content: string;
    authorId: string;
    type: string;
  }) {
    let post = doc(posts);
    await setDoc(post, {
      ...postData,
      postId: post.id,
      createdTime: serverTimestamp(),
    });
  },
  async getPostData(postId: string) {
    let docRef = doc(posts, postId);
    let docSnapshot = await getDoc(docRef);
    return docSnapshot;
  },
  async saveEditPost(postId: string, post: Post) {
    let docRef = doc(posts, postId);
    let docSnapshot = await setDoc(docRef, {
      ...post,
      createdTime: serverTimestamp(),
    });
    return docSnapshot;
  },
  async deletePost(postId: string) {
    let docRef = doc(posts, postId);
    let docSnapshot = await deleteDoc(docRef);
    return docSnapshot;
  },
  async getPosts() {
    const q = query(posts);
    const querySnapshot = getDocs(q);
    return querySnapshot;
  },
  async saveComment(
    postId: string,
    comment: { content: string; authorId: string; createdTime: number }
  ) {
    let docRef = doc(posts, postId);
    await updateDoc(docRef, { comments: arrayUnion(comment) });
  },
  async saveEditComment(postId: string, comments: Comment[]) {
    let docRef = doc(posts, postId);
    await updateDoc(docRef, { comments: comments });
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
