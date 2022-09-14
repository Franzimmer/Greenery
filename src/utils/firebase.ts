import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  CollectionReference,
  doc,
  getDoc,
  getDocs,
  where,
  updateDoc,
  deleteDoc,
  query,
  setDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { UserInfo } from "../types/userInfoType";
import { message } from "../components/SideBar/Chatroom/Chatroom";
import { Comment, Post } from "../pages/Forum/ForumPost";
import { PlantCard } from "../types/plantCardType";
import { Note } from "../types/notificationType";

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
const cards = collection(db, "cards") as CollectionReference<PlantCard>;
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
    return post.id;
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
  async getCardData(cardId: string) {
    let docRef = doc(cards, cardId);
    const docSnapshot = await getDoc(docRef);
    return docSnapshot;
  },
  async getCards(cardIds: string[]) {
    if (cardIds.length === 0) return;
    const q = query(cards, where("cardId", "in", cardIds));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  },
  async addCard(data: PlantCard) {
    const newCard = doc(cards);
    await setDoc(newCard, {
      ...data,
      cardId: newCard.id,
    });
  },
  async editCard(cardId: string, data: PlantCard) {
    const docRef = doc(cards, cardId);
    await setDoc(docRef, data);
  },
  async addFollowList(selfId: string, followId: string) {
    let docRef = doc(users, selfId);
    let followerDocRef = doc(users, followId, "notices", "followers");
    let updateFollowList = updateDoc(docRef, {
      followList: arrayUnion(followId),
    });
    let appendFollower = updateDoc(followerDocRef, {
      followers: arrayUnion(selfId),
    });
    Promise.all([updateFollowList, appendFollower]);
  },
  async removeFollowList(selfId: string, followId: string) {
    let docRef = doc(users, selfId);
    let followerDocRef = doc(users, followId, "notices", "followers");
    let updateFollowList = updateDoc(docRef, {
      followList: arrayRemove(followId),
    });
    let removeFollower = updateDoc(followerDocRef, {
      followers: arrayRemove(selfId),
    });
    Promise.all([updateFollowList, removeFollower]);
  },
  async getUsers(idList: string[]) {
    if (!idList.length) return;
    const q = query(users, where("userId", "in", idList));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  },
  async getChatrooms(userId: string) {
    const q = query(chatrooms, where("users", "array-contains", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  },
  async emitNotice(
    userId: string,
    targetId: string,
    type: string,
    postId?: string
  ) {
    let noticesCol = collection(db, "users", targetId, "notices");
    let notice = doc(noticesCol);
    let data = {
      userId,
      type,
      noticeId: notice.id,
      read: false,
      time: serverTimestamp(),
    } as Note;
    if (postId) {
      data["postId"] = postId;
    }
    await setDoc(notice, data);
  },
  async emitNotices(
    userId: string,
    followersId: string[],
    type: string,
    postId?: string
  ) {
    if (followersId.length) {
      let promises = followersId.map((targetId) => {
        return this.emitNotice(userId, targetId, type, postId);
      });
      Promise.all(promises);
    } else return;
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
