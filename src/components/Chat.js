import React, { useContext } from "react";
import Messages from "../components/Messages";
import Input from "../components/Input";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <img src={require("../components/videoCam.png")} alt="" style={{ height: "25px" }} />
          <img src={require("../components/add.png")} alt="" style={{ height: "25px" }} />
          <img src={require("../components/more.png")} alt="" style={{ height: "25px" }} />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;