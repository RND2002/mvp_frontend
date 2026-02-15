import { io } from "socket.io-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

/**
 * Socket.io client instance.
 * Using a singleton pattern to ensure only one connection is active.
 */
export const socket = io(BACKEND_URL, {
    autoConnect: false, // Don't connect until we explicitly call connect()
});

/**
 * Join a specific booking room to receive real-time updates.
 * Room name follows the backend convention: booking:${bookingId}
 */
export const joinBookingRoom = (bookingId: string) => {
    if (!socket.connected) {
        socket.connect();
    }

    console.log(`[Socket] Joining room: booking:${bookingId}`);
    socket.emit("join_booking", bookingId);
};

/**
 * Leave a specific booking room.
 */
export const leaveBookingRoom = (bookingId: string) => {
    console.log(`[Socket] Leaving room: booking:${bookingId}`);
    socket.emit("leave_booking", bookingId);
};
