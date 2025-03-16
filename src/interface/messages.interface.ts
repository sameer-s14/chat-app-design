export interface IMessageFiles {
  url: string;
  type: string;
  name: string;
  size: number;
  format: string;
}

export interface ISendMessage {
  senderId: string;
  message?: string;
  chatId: string;
  replyTo: string;
  files?: IMessageFiles[];
}

export interface IReaction {
  senderId: string;
  chatId: string;
  messageId: string;
  emoji: string;
  name?: string
}