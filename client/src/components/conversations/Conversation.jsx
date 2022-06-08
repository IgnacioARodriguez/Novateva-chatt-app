import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { TypingContext } from "../../context/TypingContext/TypingContext";
import "./conversation.css";
import { getContact, getNonReadMessages } from "./conversationHelper";

export default function Conversation({ conversation, currentUser }) {
  const [contact, setContact] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [userTyping, setUserTyping] = useState([]);
  const { typing } = useContext(TypingContext);
  const socket = useRef();

  useEffect(() => {
    getContact(currentUser, setContact, conversation);
  }, [currentUser, conversation]);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("someoneLetTyping", (data) => {
      getNonReadMessages(currentUser, contact, setUnreadMessages);
    });
  }, []);

  useEffect(() => {
    getNonReadMessages(currentUser, contact, setUnreadMessages);
  }, [contact]);

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
        <typography className="usernameContacts">
          {contact?.username}
        </typography>
        <typography className="status">Online</typography>
      </div>
      <div className="typingOrCountContainer">
        {contact?._id === typing?.userId ? (
          <div className="typingBadge">typing ...</div>
        ) : unreadMessages.length === 0 ? null : (
          <div className="unreadMessagesCount">{unreadMessages.length}</div>
        )}
      </div>
    </div>
  );
}
