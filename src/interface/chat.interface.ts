export interface Conversation {
  _id: string;
  name: string;
  image: string;
  isOnline?: boolean;
  isGroup?: boolean;
  latestMessage?: {
    message?: string;
    type?: string;
    createdAt?: string;
  };
  unreadCount: number;
}