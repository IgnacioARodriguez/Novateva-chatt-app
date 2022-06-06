export const isTyping = async (user, dispatch) => {
  await dispatch({ type: "TYPING_START" });
  try {
    await dispatch({
      type: "TYPING_SUCCESS",
      payload: user,
    });
  } catch (err) {
    console.log("falle");
  }
};
