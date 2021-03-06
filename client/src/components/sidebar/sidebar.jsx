import "./sidebar.css";
import axios from "axios";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthState/AuthContext";
import settingsIcon from "./Group 11.1.png";
import { io } from "socket.io-client";
import { useHistory } from "react-router-dom";

export default function Sidebar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [unreadMessages, setUnreadMessages] = useState([]);
  const { user } = useContext(AuthContext);
  const socket = useRef();
  const history = useHistory();

  const handleClickLogout = () => {
    window.localStorage.removeItem("user");
    window.location.reload();
  };

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("someoneLetTyping", (data) => {
      const getNonReadMessages = async () => {
        const nonReadMessagesFromDb = await axios.get(
          "/messages/noRead/" + user?._id
        );
        setUnreadMessages(nonReadMessagesFromDb.data);
      };
      getNonReadMessages();
    });
  }, []);

  useEffect(() => {
    const getNonReadMessages = async () => {
      const nonReadMessagesFromDb = await axios.get(
        "/messages/noRead/" + user?._id
      );
      setUnreadMessages(nonReadMessagesFromDb.data);
    };
    getNonReadMessages();
  }, []);

  return (
    <div className="sideBarContainer">
      <div className="chatContainer">
        <QuestionAnswerOutlinedIcon
          style={{ height: "18px", marginLeft: "57px", marginRight: "15px" }}
        />
        <div className="chatText">Chat</div>
        <div className="messageCountContainer">
          <div className="messageCount">{unreadMessages.length}</div>
        </div>
      </div>
      <div className="logoutContainer">
        <img src={settingsIcon} />
        <button onClick={handleClickLogout} className="logoutButon">
          Logout
        </button>
      </div>
    </div>
  );
}
