export enum SOCKET_EVENTS {
    SET_UP = 'setup',
    SEND_MESSAGE = 'send-message',
    JOIN_CHAT = 'join-chat',
    RECEIVE_MESSAGE = 'receive-message',
}

export enum MESSAGE_TYPES {
    TEXT = 'text',
    FILE = 'file',
    EVENT = 'event',
    REPLY = 'reply',
}