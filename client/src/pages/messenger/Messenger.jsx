import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthState/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { UserContext } from "../../context/UserState/UserContext";
import Sidebar from "../../components/sidebar/sidebar";
import ContactsBar from "../../components/contactsBar/ContactsBar";
import { TypingContext } from "../../context/TypingContext/TypingContext";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  // const [typing, setTyping] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const { conversation } = useContext(UserContext);
  const { dispatch } = useContext(TypingContext);
  const { typing } = useContext(TypingContext);
  const scrollRef = useRef();

  useEffect(() => {
    const getUsersList = async () => {
      const usersListFromDb = await axios.get("users/list");
      setUsersList([usersListFromDb.data]);
    };
    getUsersList();
  }, [conversation]);

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
    console.log(conversation)
  }, [user._id, conversation]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const receiverId = currentChat?.members.find((member) => member !== user._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    socket.current.emit("notTyping", {});

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.current.on("someoneTyping", (userTyping) => {
      const isTyping = async () => {
        await dispatch({
          type: "TYPING_SUCCESS",
          payload: userTyping,
        });
      };
      isTyping();
    });
    socket.current.on("someoneLetTyping", () => {
      const isTyping = async () => {
        await dispatch({
          type: "TYPING_STOP",
        });
      };
      isTyping();
    });
  }, []);

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
                          }
                          if (
                            e.target.value !== "" &&
                            user._id === currentChat.members[0]
                          ) {
                            socket.current.emit("typing", {
                              userId: currentChat.members[1],
                            });
                          } else if (
                            e.target.value !== "" &&
                            user._id === currentChat.members[1]
                          ) {
                            socket.current.emit("typing", {
                              userId: currentChat.members[0],
                            });
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
