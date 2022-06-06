export const typingStart = () => ({
  type: "TYPING_START",
});

export const typingSuccess = (typing) => ({
  type: "TYPING_SUCCESS",
  payload: typing,
});

export const typingStop = () => ({
  type: "TYPING_STOP",
});
