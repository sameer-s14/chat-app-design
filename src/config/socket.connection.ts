import io from "socket.io-client";
import { BASE_URL } from ".";

export const createSocketConnection = (token: string) => {
    return io(BASE_URL, {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
        transports: ["websocket"],
        rejectUnauthorized: false,
    });
}