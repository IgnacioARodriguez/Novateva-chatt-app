export const createConverSationStart = () => ({
    type: "CREATE_CONVERSATION_START",
  });
  
  export const createConversationSuccess = (conversation) => ({
    type: "CREATE_CONVERSATION_SUCCESS",
    payload: conversation,
  });
  
  export const createConversationFailure = () => ({
    type: "CREATE_CONVERSATION_FAILURE",
  });
  