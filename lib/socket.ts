import { io } from "socket.io-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

/**
 * Socket.io client instance.
 * Using a singleton pattern to ensure only one connection is active.
 */
export const socket = io(BACKEND_URL, {
    autoConnect: false, // Don't connect until we explicitly call connect()
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
});

// Track the current room to re-join on reconnection
let currentBookingId: string | null = null;

// Socket connection event listeners for debugging and robustness
socket.on("connect", () => {
    console.log("[Socket] Connected to server with ID:", socket.id);

    // If we were in a room before disconnecting, re-join it
    if (currentBookingId) {
        console.log(`[Socket] Re-joining room: booking:${currentBookingId}`);
        socket.emit("join_booking", currentBookingId);
    }
});

socket.on("connect_error", (error) => {
    console.error("[Socket] Connection Error:", error);
});

socket.on("disconnect", (reason) => {
    console.log("[Socket] Disconnected from server:", reason);
});

/**
 * Join a specific booking room to receive real-time updates.
 * Room name follows the backend convention: booking:${bookingId}
 */
export const joinBookingRoom = (bookingId: string) => {
    currentBookingId = bookingId;

    if (!socket.connected) {
        socket.connect();
    } else {
        console.log(`[Socket] Joining room: booking:${bookingId}`);
        socket.emit("join_booking", bookingId);
    }
};

/**
 * Leave a specific booking room.
 */
export const leaveBookingRoom = (bookingId: string) => {
    if (currentBookingId === bookingId) {
        currentBookingId = null;
    }
    console.log(`[Socket] Leaving room: booking:${bookingId}`);
    socket.emit("leave_booking", bookingId);
};
