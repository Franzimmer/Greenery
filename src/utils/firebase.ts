import { initializeApp } from "firebase/app";
import { v4 as uuidv4 } from "uuid";
import {
  getFirestore,
  collection,
  CollectionReference,
  DocumentReference,
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
  increment,
  orderBy,
  limit,
  addDoc,
} from "firebase/firestore";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { UserInfo } from "../store/types/userInfoType";
import { message } from "../components/Chatroom/Chatroom";
import { Comment, Post } from "../pages/Forum/ForumPost/ForumPost";
import { PlantCard } from "../store/types/plantCardType";
import { Note } from "../store/types/notificationType";
import { unixTimeToString } from "./helpers";
interface followerDocType {
  followers: string[];
}

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
  //userinfo collection
  async initUserInfo(uid: string, data: UserInfo) {
    const docRef = doc(users, uid);
    await setDoc(docRef, data);
  },
  async getUserInfo(id: string) {
    const docRef = doc(users, id);
    const docSnapshot = await getDoc(docRef);
    return docSnapshot;
  },
  async getUsers(idList: string[]) {
    if (!idList.length) return;
    const q = query(users, where("userId", "in", idList));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  },
  async updateUserPhoto(id: string, url: string) {
    const docRef = doc(users, id);
    await updateDoc(docRef, { photoUrl: url });
  },
  async updateUserName(id: string, name: string) {
    const docRef = doc(users, id);
    await updateDoc(docRef, { userName: name });
  },
  async addFollowList(selfId: string, followId: string) {
    const docRef = doc(users, selfId);
    const followerDocRef = doc(
      users,
      followId,
      "notices",
      "followers"
    ) as DocumentReference<followerDocType>;
    const result = await getDoc(followerDocRef);
    let appendFollower;
    if (!result.exists()) {
      appendFollower = setDoc(followerDocRef, {
        followers: [selfId],
      });
    } else {
      appendFollower = updateDoc(followerDocRef, {
        followers: arrayUnion(selfId),
      });
    }
    const updateFollowList = updateDoc(docRef, {
      followList: arrayUnion(followId),
    });

    Promise.all([updateFollowList, appendFollower]);
  },
  async removeFollowList(selfId: string, followId: string) {
    const docRef = doc(users, selfId);
    const followerDocRef = doc(users, followId, "notices", "followers");
    const updateFollowList = updateDoc(docRef, {
      followList: arrayRemove(followId),
    });
    const removeFollower = updateDoc(followerDocRef, {
      followers: arrayRemove(selfId),
    });
    Promise.all([updateFollowList, removeFollower]);
  },
  async emitNotice(
    userId: string,
    targetId: string,
    type: string,
    postId?: string
  ) {
    const noticesCol = collection(db, "users", targetId, "notices");
    const notice = doc(noticesCol);
    const data = {
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
      const promises = followersId.map((targetId) => {
        return this.emitNotice(userId, targetId, type, postId);
      });
      await Promise.all(promises);
    } else return;
  },
  async deleteNotice(userId: string, noticeId: string) {
    const docRef = doc(db, "users", userId, "notices", noticeId);
    await deleteDoc(docRef);
  },
  async updateNoticeReadStatus(userId: string, noticeId: string) {
    const docRef = doc(db, "users", userId, "notices", noticeId);
    await updateDoc(docRef, { read: true });
  },
  async getEvent(docName: string, id: string) {
    const activitiesRef = collection(db, "users", id, "activities");
    const docRef = doc(activitiesRef, docName);
    const docSnapshot = await getDoc(docRef);
    return docSnapshot;
  },
  async addEvents(
    type: "water" | "fertilize",
    cardIds: string[],
    userId: string
  ) {
    const docName = unixTimeToString(Date.now());
    const activitiesRef = collection(db, "users", userId, "activities");
    const docRef = doc(activitiesRef, docName);
    const docSnapshot = await getDoc(docRef);
    if (!docSnapshot.exists()) {
      await setDoc(docRef, { watering: [], fertilizing: [] });
    }
    if (type === "water") {
      await updateDoc(docRef, { watering: arrayUnion(...cardIds) });
    } else if (type === "fertilize") {
      await updateDoc(docRef, { fertilizing: arrayUnion(...cardIds) });
    }
  },
  async getGallery(userId: string) {
    const docRef = doc(users, userId);
    const docSnapshot = await getDoc(docRef);
    return docSnapshot;
  },
  async addGallery(userId: string, link: string) {
    const docRef = doc(users, userId);
    await updateDoc(docRef, { gallery: arrayUnion(link) });
  },
  async deleteGallery(userId: string, link: string) {
    const docRef = doc(users, userId);
    await updateDoc(docRef, { gallery: arrayRemove(link) });
  },
  async addFavCard(userId: string, cardId: string) {
    const docRef = doc(users, userId);
    const cardDocRef = doc(cards, cardId);
    const updateUser = updateDoc(docRef, { favoriteCards: arrayUnion(cardId) });
    const updateCard = updateDoc(cardDocRef, { followers: increment(1) });
    await Promise.all([updateUser, updateCard]);
  },
  async removeFavCard(userId: string, cardId: string) {
    const docRef = doc(users, userId);
    const cardDocRef = doc(cards, cardId);
    const updateUser = updateDoc(docRef, {
      favoriteCards: arrayRemove(cardId),
    });
    const updateCard = updateDoc(cardDocRef, { followers: increment(-1) });
    await Promise.all([updateUser, updateCard]);
  },
  //chatroom
  async checkChatroom(users: string[]) {
    const usersCopy = [...users];
    const q = query(
      chatrooms,
      where("users", "in", [users, usersCopy.reverse()])
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      await addDoc(chatrooms, {
        users: users,
        msgs: [],
      });
    }
  },
  async storeChatroomData(users: string[], msg: message) {
    const usersCopy = [...users];
    const q = query(
      chatrooms,
      where("users", "in", [users, usersCopy.reverse()])
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      const room = doc(chatrooms);
      await setDoc(room, { users: users, msgs: [msg] });
    } else {
      querySnapshot.forEach(async (docData) => {
        const docRef = doc(chatrooms, docData.id);
        const docMsgs = docData.data().msgs;
        await updateDoc(docRef, { msgs: [...docMsgs, msg] });
      });
    }
  },
  async getChatrooms(userId: string) {
    const q = query(chatrooms, where("users", "array-contains", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  },
  async findChatroom(users: string[]) {
    const usersFlip = [...users].reverse();
    const q = query(chatrooms, where("users", "in", [users, usersFlip]));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  },
  //cards coolection
  async changePlantOwner(cardId: string, newOwnerId: string) {
    const docRef = doc(cards, cardId);
    await updateDoc(docRef, { ownerId: newOwnerId });
  },
  async getCardsByIds(cardIds: string[]) {
    if (cardIds.length === 0) return;
    const q = query(cards, where("cardId", "in", cardIds));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  },
  async getUserCards(ownerId: string) {
    const q = query(
      cards,
      where("ownerId", "==", ownerId),
      orderBy("createdTime", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  },
  async getPopularCards() {
    const q = query(cards, orderBy("followers", "desc"), limit(10));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  },
  async addCard(data: PlantCard) {
    const newCard = doc(cards);
    await setDoc(newCard, {
      ...data,
      cardId: newCard.id,
      createdTime: serverTimestamp(),
    });
    return newCard.id;
  },
  async editCard(cardId: string, data: PlantCard) {
    const docRef = doc(cards, cardId);
    await setDoc(docRef, data);
  },
  async deleteCard(cardId: string) {
    await deleteDoc(doc(db, "cards", cardId));
  },
  //post collection
  async addPost(postData: {
    title: string;
    content: string;
    authorId: string;
    type: string;
  }) {
    const post = doc(posts);
    await setDoc(post, {
      ...postData,
      postId: post.id,
      createdTime: serverTimestamp(),
    });
    return post.id;
  },
  async getPostData(postId: string) {
    const docRef = doc(posts, postId);
    const docSnapshot = await getDoc(docRef);
    return docSnapshot;
  },
  async saveEditPost(postId: string, post: Post) {
    const docRef = doc(posts, postId);
    const docSnapshot = await setDoc(docRef, {
      ...post,
      createdTime: serverTimestamp(),
    });
    return docSnapshot;
  },
  async deletePost(postId: string) {
    const docRef = doc(posts, postId);
    const docSnapshot = await deleteDoc(docRef);
    return docSnapshot;
  },
  async getPosts() {
    const q = query(posts, orderBy("createdTime", "desc"));
    const querySnapshot = getDocs(q);
    return querySnapshot;
  },
  async saveComment(
    postId: string,
    comment: { content: string; authorId: string; createdTime: number }
  ) {
    const docRef = doc(posts, postId);
    await updateDoc(docRef, { comments: arrayUnion(comment) });
  },
  async saveEditComment(postId: string, comments: Comment[]) {
    const docRef = doc(posts, postId);
    await updateDoc(docRef, { comments: comments });
  },
  // diary collection
  async getDiary(diaryId: string) {
    const docRef = doc(diaries, diaryId);
    const docSnapshot = await getDoc(docRef);
    return docSnapshot;
  },
  async saveDiary(diaryId: string, page: string) {
    const docRef = doc(diaries, diaryId);
    const docSnapshot = await getDoc(docRef);
    if (!docSnapshot.exists()) {
      await setDoc(docRef, { pages: [] });
    }
    await updateDoc(docRef, { pages: arrayUnion(page) });
  },
  async saveEditDiary(diaryId: string, currentDiaries: string[]) {
    const docRef = doc(diaries, diaryId);
    await setDoc(docRef, { pages: currentDiaries });
  },
  async checkDiaryExistence(id: string) {
    const docRef = doc(diaries, id);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) return true;
    else return false;
  },
  async checkDiariesExistence(idList: string[]) {
    const promises = idList.map((id) => {
      return this.checkDiaryExistence(id);
    });
    const result = await Promise.all(promises);
    return result;
  },
  async searchSpecies(input: string) {
    const q = query(species, where("NAME", "==", input));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  },
  async uploadFile(file: File) {
    const galleryId = uuidv4();
    const storageRef = ref(storage, `${galleryId}`);
    await uploadBytes(storageRef, file);
    const dowloadLink = await getDownloadURL(storageRef);
    return dowloadLink;
  },
};

export { db, chatrooms, auth, firebase };
