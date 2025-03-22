// src/contexts/SocketContext.js

import React, { useEffect } from "react";
import { createSocketConnection } from "../config/socket.connection";
import { useDispatch, useSelector } from "react-redux";
import { SOCKET_EVENTS } from "../constants";
import { setSocket } from "../redux/socketSlice";


// Socket provider to manage socket connection
export const SocketProvider = ({ children }) => {
    const { user, token } = useSelector((state) => state?.auth);
    const disptach = useDispatch()
    useEffect(() => {
        if (token) {
            const newSocket = createSocketConnection(token, user?.userId);
            disptach(setSocket(newSocket))

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
