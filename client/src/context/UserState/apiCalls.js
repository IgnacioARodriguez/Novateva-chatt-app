import axios from "axios";

export const createConversationCall = async (user, userSearched, dispatch) => {
  dispatch({ type: "CREATE_CONVERSATION_START" });
  try {
    console.log('pase')
    const newConversation = await axios.post("/conversations", {
      senderId: user,
      receiverId: userSearched,
    });
    dispatch({
      type: "CREATE_CONVERSATION_SUCCESS",
      payload: newConversation.data,
    });
  } catch (err) {
    console.log(err)
    dispatch({ type: "CREATE_CONVERSATION_FAILURE", payload: err });
  }
};
