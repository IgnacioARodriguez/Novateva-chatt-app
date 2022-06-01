import axios from "axios";

export const createConversationCall = async (user, userSearched, dispatch) => {
  console.log("llegue");
  dispatch({ type: "CREATE_CONVERSATION_START" });
  try {
    const newConversation = await axios.post("/conversations", {
      senderId: user,
      receiverId: userSearched,
    });
    dispatch({
      type: "CREATE_CONVERSATION_SUCCESS",
      payload: newConversation.data,
    });
    console.log(newConversation.data);
  } catch (err) {
    console.log("falle");
    dispatch({ type: "CREATE_CONVERSATION_FAILURE", payload: err });
  }
};
