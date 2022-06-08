import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthState/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { UserContext } from "../../context/UserState/UserContext";
import Sidebar from "../../components/sidebar/sidebar";
import { getConversations, getMessages, getUsersList } from "./messengerHelper";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const { conversation } = useContext(UserContext);
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      // users.map((user) => {
      //   usersList.map((dbUser) => {
      //     if (user.userId === dbUser._id) {
      //       setOnlineUsers([...onlineUsers, dbUser]);
      //     }
      //   });
      // });
      setOnlineUsers(
        usersList.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  useEffect(() => {
    getConversations(setConversations, user);
    getUsersList(setUsersList);
  }, [user._id, conversation]);

  useEffect(() => {
    getMessages(currentChat, setMessages);
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const receiverId = currentChat?.members.find(
      (member) => member !== user._id
    );
    const message = {
      sender: user._id,
      text: newMessage,
      receiver: receiverId,
      conversationId: currentChat._id,
    };

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId: receiverId,
      text: newMessage,
    });

    socket.current.emit("notTyping", { userId: user._id });

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Topbar />
      <div className="messenger">
        <Sidebar className="sideBar" />
        <div className="ContactsChatContainer">
          <div className="imgAndUsernamePersonal">
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
            <div className="connectedBadgePersonal"></div>
            <div className="nameAndStatusPersonal">
              <typography className="usernamePersonal">
                {user.username}
              </typography>
              <typography className="statusPersonal">Online</typography>
            </div>
          </div>
          <div className="chatMenu">
            <div className="chatMenuWrapper">
              {conversations.map((c) => (
                <div onClick={() => setCurrentChat(c)}>
                  <Conversation conversation={c} currentUser={user} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <button className="newChatButton">New chat</button>
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message
                        message={m}
                        own={m.sender === user._id}
                        elses={
                          currentChat.members[0] === user._id
                            ? currentChat.members[1]
                            : currentChat.members[0]
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <form>
                    <div className="messengerInputContainer">
                      <input
                        className="chatMessageInput"
                        placeholder="Start typing here"
                        onChange={(e) => {
                          if (e.target.value === "") {
                            socket.current.emit("notTyping", {});
                          } else {
                            socket.current.emit("typing", {
                              userId: user._id,
                            });
                            // } else if (
                            //   e.target.value !== "" &&
                            //   user._id === currentChat.members[1]
                            // ) {
                            //   socket.current.emit("typing", {
                            //     userId: currentChat.members[0],
                            //   });
                          }
                          setNewMessage(e.target.value);
                        }}
                        value={newMessage}
                        onSubmit={handleSubmit}
                      />
                      <button
                        className="chatSubmitButton"
                        onClick={handleSubmit}
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
