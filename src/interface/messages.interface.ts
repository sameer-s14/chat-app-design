export interface IMessageFiles {
    url: string;
    type: string;
    name: string;
    size: number;
  }
  
  export interface ISendMessage {
    senderId: string;
    message?: string;
    chatId: string;
    files?: IMessageFiles[];
  }