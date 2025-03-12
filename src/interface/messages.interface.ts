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
  files?: IMessageFiles[];
}