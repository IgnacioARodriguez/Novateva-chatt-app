const TypingReducer = (state, action) => {
  switch (action.type) {
    case "TYPING_START":
      return {
        typing: null,
        isFetching: true,
        error: false,
      };
    case "TYPING_SUCCESS":
      return {
        typing: action.payload,
        isFetching: false,
        error: false,
      };
    case "TYPING_STOP":
      return {
        typing: null,
        isFetching: false,
        error: false,
      };
    default:
      return state;
  }
};

export default TypingReducer;
