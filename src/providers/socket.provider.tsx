// src/contexts/SocketContext.js

import React, { useEffect } from "react";
import { createSocketConnection } from "../config/socket.connection";
import { useDispatch, useSelector } from "react-redux";
import { SOCKET_EVENTS } from "../constants";
import { addOnlineUsers, removeOnlineUsers, removeTyping, setSocket, setTyping } from "../redux/socketSlice";


// Socket provider to manage socket connection
export const SocketProvider = ({ children }) => {
    const { user, token } = useSelector((state) => state?.auth);
    const dispatch = useDispatch()
    useEffect(() => {
        if (token) {
            // connection
            const newSocket = createSocketConnection(token, user?.userId);
            dispatch(setSocket(newSocket))

            // is user online
            newSocket.on(SOCKET_EVENTS.USER_ONLINE, (onlineUserId) => {
                dispatch(addOnlineUsers({ userId: onlineUserId }));
            });

            // offline users
            newSocket.on(SOCKET_EVENTS.USER_OFFLINE, (onlineUserId) => {
                dispatch(removeOnlineUsers({ userId: onlineUserId }));
            });

            // Typing events
            newSocket.on(SOCKET_EVENTS.TYPING, ({ chatId, user }) => {
                dispatch(setTyping({ chatId, user }));
            });

            newSocket.on(SOCKET_EVENTS.STOP_TYPING, ({ chatId }) => {
                dispatch(removeTyping({ chatId }));
            });

            return () => {
                newSocket.disconnect();
            };
        }
    }, [user]);


    return (
        <>
            {children}
        </>
    );
};
