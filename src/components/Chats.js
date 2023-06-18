import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      if (currentUser && currentUser.uid) {
        console.log("Fetching chats for user with UID:", currentUser.uid);
        const chatRef = doc(db, "userChats", currentUser.uid);
        const unsubscribe = onSnapshot(chatRef, (doc) => {
          const data = doc.data();
          console.log("Received chat data:", data);
          if (data) {
            const entries = Object.entries(data);
            setChats(entries);
          } else {
            setChats([]);
          }
        });

        return unsubscribe;
      }
    };

    let unsubscribeChats;
    if (currentUser) {
      console.log("Current user:", currentUser);
      unsubscribeChats = getChats();
    }

    return () => {
      console.log("Unsubscribing from chat updates");
      if (unsubscribeChats) {
        unsubscribeChats();
      }
    };
  }, [currentUser]);

  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  console.log("Rendered chats:", chats);

  return (
    <div className="chats">
      {chats &&
        chats
          .sort((a, b) => b[1].date - a[1].date)
          .map((chat) => (
            <div
              className="userChat"
              key={chat[0]}
              onClick={() => handleSelect(chat[1]?.userInfo)}
            >
              <img src={chat[1]?.userInfo?.photoURL} alt="" />
              <div className="userChatInfo">
                <span>{chat[1]?.userInfo?.displayName}</span>
                <p>{chat[1]?.lastMessage?.text}</p>
              </div>
            </div>
          ))}
    </div>
  );
};

export default Chats;
