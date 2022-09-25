import { FieldValue } from "firebase/firestore";

export interface Note {
  time: FieldValue;
  type: string;
  userId: string;
  postId?: string;
  read: boolean;
  noticeId: string;
}
