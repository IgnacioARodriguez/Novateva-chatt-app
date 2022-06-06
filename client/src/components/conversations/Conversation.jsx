import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { TypingContext } from "../../context/TypingContext/TypingContext";
import "./conversation.css";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const { typing } = useContext(TypingContext);
  const socket = useRef();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios("/users?userId=" + friendId);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation, typing]);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("someoneLetTyping", (data) => {
      const getNonReadMessages = async () => {
        const nonReadMessagesFromDb = await axios.get(
          "/messages/noRead/" + currentUser._id
        );
        setUnreadMessages(nonReadMessagesFromDb.data);
      };
      getNonReadMessages();
    });
  }, []);

  useEffect(() => {
    const getNonReadMessages = async () => {
      const nonReadMessagesFromDb = await axios.get(
        "/messages/noRead/" + currentUser._id
      );
      setUnreadMessages(nonReadMessagesFromDb.data);
    };
    getNonReadMessages();
  }, []);

  return (
    <div className="imgAndUsernameContacts">
      <img
        src={
          // user.profilePicture
          //   ? PF + user.profilePicture
          //   : PF + "person/noAvatar.png"
          "https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
        }
        alt=""
        className="topbarImg"
      />
      <div className="connectedBadge"></div>
      <div className="nameAndStatus">
        <typography className="usernameContacts">{user?.username}</typography>
        <typography className="status">Online</typography>
      </div>
      <div className="typingOrCountContainer">
        {currentUser?._id === typing?.userId ? (
          <div className="typingBadge">typing ...</div>
        ) : (
          <div className="unreadMessagesCount">{unreadMessages.length}</div>
        )}
      </div>
    </div>
  );
}
