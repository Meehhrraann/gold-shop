"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

// Define the shape of our context
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    // 1. If no user session, do not connect
    if (!session?.user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // 2. Initialize Socket Connection
    // Using an env variable is best practice, fallback to localhost
    const SOCKET_URL =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

    const socketInstance = io(SOCKET_URL, {
      // Pass auth details if your server requires handshake auth
      // auth: { token: session.accessToken },
      transports: ["websocket"], // optional: force websocket
    });

    // 3. Setup Listeners
    socketInstance.on("connect", () => {
      console.log("✅ Socket Connected:", socketInstance.id);
      setIsConnected(true);

      // Trigger the 'join' event your server expects for online status
      // Assumes your session object has an id. If not, use email.
      const userId = (session.user as any).id || session.user.email;
      socketInstance.emit("join", userId);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Socket Disconnected");
      setIsConnected(false);
    });

    // Global listener for online users (since this affects the whole app)
    socketInstance.on("onlineUsers", (users: string[]) => {
      setOnlineUsers(users);
    });

    setSocket(socketInstance);

    // 4. Cleanup on unmount or session change
    return () => {
      socketInstance.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
