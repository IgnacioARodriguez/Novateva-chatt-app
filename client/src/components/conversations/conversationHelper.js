import axios from "axios";

export const getContact = async (currentUser, setContact, conversation) => {
  try {
    const contactId = conversation.members.find((m) => m !== currentUser._id);
    const res = await axios("/users?userId=" + contactId);
    setContact(res.data);
  } catch (err) {
    console.log(err);
  }
};

export const getNonReadMessages = async (
  currentUser,
  contact,
  setUnreadMessages
) => {
  const nonReadMessagesFromDb = await axios.get(
    "/messages/noRead/" + currentUser._id + "/" + contact?._id
  );
  setUnreadMessages(nonReadMessagesFromDb.data);
};
