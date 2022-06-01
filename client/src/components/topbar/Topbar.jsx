import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthState/AuthContext";
import { createConversationCall } from "../../context/UserState/apiCalls";
import { UserContext } from "../../context/UserState/UserContext";

export default function Topbar() {
  const [usernameSearched, setUsernameSearched] = useState("");
  const { user } = useContext(AuthContext);
  const { dispatch } = useContext(UserContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  function handleChange(e) {
    e.preventDefault();
    setUsernameSearched(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const userSearched = await axios.get(
        "/users/?username=" + usernameSearched
      );
      // const newConversation = await axios.post("/conversations", {
      //   senderId: user._id,
      //   receiverId: userSearched.data._id,
      // });
      await createConversationCall(user._id, userSearched.data._id, dispatch);
    } catch (e) {
      console.log("user not found");
    }
  }

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Lamasocial</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <form onSubmit={handleSubmit}>
            <input
              placeholder="User search"
              className="searchInput"
              type="text"
              value={usernameSearched}
              onChange={handleChange}
            />
          </form>
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
