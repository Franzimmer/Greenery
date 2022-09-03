export interface notification {
  msgId: string;
  type: number;
  userId: string;
  userName: string;
  cardId?: string;
  articleId?: string;
  read: boolean;
}
