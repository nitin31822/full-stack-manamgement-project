"use client";

import React, { useCallback, useState, useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { IMessage } from "@/types/ApiResponse";
import { ITask , user } from "@/types/ApiResponse";
import { getSession, useSession } from "next-auth/react";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface RoomAcknowledgeMent {
  status: boolean;
}


interface IsocketContext {
  sendMessage: (roomName: string, Message: IMessage) => Promise<boolean>;
  joinRoom: (roomName: string) => Promise<boolean>;
  Messages: Array<IMessage>;
  clearMessages: () => void;
  createRoomName: (user1: user, user2: user) => string;
  sendTask: (roomName: string, Task: ITask) => Promise<boolean>;
  Tasks: Array<ITask>;
  clearTasks: () => void;
}

const socketContext = React.createContext<IsocketContext | null>(null);
export const useSocket = () => {
  const state = useContext(socketContext);

  if (!state) throw new Error("state not defined");

  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [Socket, setSocket] = useState<Socket>();
  const [Messages, setMessages] = useState<IMessage[]>([]);
  const [Tasks, setTasks] = useState<ITask[]>([]);
 

  

  const joinRoom = useCallback(
    async (roomName: string) => {
      if (Socket === undefined) {
        console.log("Socket Undefined");

        return false;
      }

      const res: RoomAcknowledgeMent = await Socket.emitWithAck(
        "joinRoom",
        roomName
      );

      console.log("socket emit");

      if (res.status === false) {
        return false;
      }

      return true;
    },
    [Socket]
  );
  const sendTask: IsocketContext["sendTask"] = useCallback(
    async (roomName: string, Task: ITask) => {
      const res: RoomAcknowledgeMent = await Socket?.emitWithAck(
        "sendtask",
        roomName,
        Task
      );
      console.log("task send ", Task);

      return res.status;
    },
    [Socket]
  );

  const createRoomName = (user1: user, user2: user) => {
    // Concatenate the IDs of both users and sort them alphabetically
    const sortedIds = [user1.id, user2.id].sort();
    // Concatenate the sorted IDs again
    return sortedIds.join("_");
  };

  const sendMessage: IsocketContext["sendMessage"] = useCallback(
    async (roomName: string, Message: IMessage) => {
      const res: RoomAcknowledgeMent = await Socket?.emitWithAck(
        "sendMessage",
        roomName,
        Message
      );

      console.log("Message send ", Message);

      if (res.status === false) {
        return false;
      }
      const create = await axios.post(
        `/api/message/send-message?GroupSocketRoomName=${roomName}`,
        {
          content: Message.content,
        }
      );
      console.log(create);

      return true;
    },
    [Socket]
  );

  const onMessageRec = useCallback(
    (Item: IMessage | ITask) => {
      if ("content" in Item && "sender" in Item && "createdAt" in Item) {
        console.log("message hai");
        setMessages((prev) => [...prev, Item]);
      } else if (
        "content" in Item &&
        "title" in Item &&
        "sender" in Item &&
        "Company" in Item &&
        "isCompleted" in Item &&
        "createdAt" in Item
      ) {
        // Object is of type Task
        console.log("task hai");
        setTasks((prev) => [...prev, Item]);
      } else {
        console.error("Received data does not match expected format.");
      }
    },
    [Socket]
  );

  const clearMessages: IsocketContext["clearMessages"] = useCallback(() => {
    setMessages([]); // Clearing messages array
  }, []);

  const clearTasks: IsocketContext["clearTasks"] = useCallback(() => {
    setTasks([]); // Clearing Tasks array
  }, []);

  useEffect(() => {
    const initializeSocket = async () => {
      const _socket = io("http://localhost:3002");
      _socket.on("RecivedMessage", onMessageRec);

      setSocket(_socket);
    };

    initializeSocket();

    return () => {
      if (Socket) {
        Socket.disconnect();
        setSocket(undefined);
      }
    };
  }, []);

  useEffect(() => {
    const joinRoomIfSocketInitialized = async () => {
      if (Socket) {
        const session  = await getSession()
        const userData = session?.user
        if (userData) {
         const res =  await joinRoom(`${userData.id}_${userData.name}`);
         console.log("apna room" , res);
         
        }
        else {
          console.log("chala");
          
        }
      }
    };

    joinRoomIfSocketInitialized();

  }, [Socket, joinRoom]);

  return (
    <socketContext.Provider
      value={{
        sendMessage,
        joinRoom,
        Messages,
        clearMessages,
        createRoomName,
        sendTask,
        clearTasks,
        Tasks,
      }}
    >
      {children}
    </socketContext.Provider>
  );
};
