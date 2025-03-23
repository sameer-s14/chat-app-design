export enum SOCKET_EVENTS {
    SET_UP = 'setup',
    SEND_MESSAGE = 'send-message',
    JOIN_CHAT = 'join-chat',
    LEAVE_CHAT = 'leave-chat',
    RECEIVE_MESSAGE = 'receive-message',
    REACTION = 'reaction',
    RECEIVE_REACTION = 'receive-reaction',
    USER_ONLINE = 'user-online',
    USER_OFFLINE = 'user-offline',
    TYPING = 'typing',
    STOP_TYPING = 'stop-typing'
}

export enum MESSAGE_TYPES {
    TEXT = 'text',
    FILE = 'file',
    EVENT = 'event',
    REPLY = 'reply',
}