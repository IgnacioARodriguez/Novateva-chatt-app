import "./contactsBar.css";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import { Typography } from "@mui/material";
import { AuthContext } from "../../context/AuthState/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import Conversation from "../conversations/Conversation";
import { UserContext } from "../../context/UserState/UserContext";
import axios from "axios";

export default function ContactsBar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const { user } = useContext(AuthContext);
  const { conversation } = useContext(UserContext);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
    setCurrentChat(conversation);
  }, [user._id, conversation]);

  return (
    <div className="contactsBarContainer">
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
          <typography className="usernameContacts">{user.username}</typography>
          <typography className="status">Online</typography>
        </div>
      </div>
      <div className="chatMenu">
        <div className="chatMenuWrapper">
          <input placeholder="Search for friends" className="chatMenuInput" />
          {conversations.map((c) => (
            <div onClick={() => setCurrentChat(c)}>
              <Conversation conversation={c} currentUser={user} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
