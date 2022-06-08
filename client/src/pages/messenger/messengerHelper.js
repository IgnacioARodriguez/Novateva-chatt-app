import axios from "axios";

export const getUsersList = async (setUsersList) => {
  const usersListFromDb = await axios.get("users/list");
  setUsersList([usersListFromDb.data]);
};

export const getConversations = async (setConversations, user) => {
  try {
    const res = await axios.get("/conversations/" + user._id);
    setConversations(res.data);
  } catch (err) {
    console.log(err);
  }
};

export const getMessages = async (currentChat, setMessages) => {
  try {
    const res = await axios.get("/messages/" + currentChat?._id);
    setMessages(res.data);
  } catch (err) {
    console.log(err);
  }
};
