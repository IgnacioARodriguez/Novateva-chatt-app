const AuthReducer = (state, action) => {
  switch (action.type) {
    case "CREATE_CONVERSATION_START":
      return {
        conversation: null,
        isFetching: true,
        error: false,
      };
    case "CREATE_CONVERSATION_SUCCESS":
      return {
        conversation: action.payload,
        isFetching: false,
        error: false,
      };
    case "CREATE_CONVERSATION_FAILURE":
      return {
        conversation: null,
        isFetching: false,
        error: true,
      };
    default:
      return state;
  }
};

export default AuthReducer;
