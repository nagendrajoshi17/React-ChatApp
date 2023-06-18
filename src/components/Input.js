import React, { useContext, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const uploadRef = useRef(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    try {
      if (img) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.log("Error uploading image:", error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              await sendMessageWithImage(downloadURL);
              uploadRef.current.value = ""; // Clear the file input value after upload
            } catch (error) {
              console.log("Error uploading image:", error);
            }
          }
        );
      } else if (text.trim() !== "") {
        await sendMessage();
      }

      setText("");
      setImg(null);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const sendMessage = async () => {
    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion({
        id: uuid(),
        text: text.trim(),
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });

    await updateLastMessage();
  };

  const sendMessageWithImage = async (downloadURL) => {
    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion({
        id: uuid(),
        text: text.trim(),
        senderId: currentUser.uid,
        date: Timestamp.now(),
        img: downloadURL,
      }),
    });

    await updateLastMessage();
  };

  const updateLastMessage = async () => {
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text: text.trim(),
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text: text.trim(),
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img
          src={require("../components/attachFile.png")}
          alt=""
          style={{ height: "25px" }}
        />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          ref={uploadRef}
          onChange={handleFileChange}
        />
        <label htmlFor="file">
          <img
            src={require("../components/image.png")}
            alt=""
            style={{ height: "25px" }}
          />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;