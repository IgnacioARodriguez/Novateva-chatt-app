const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const statusUsers = () => {};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");
  let usersOnlineStatus = [];
  //take userId and socketId from user
  socket.on("addUser", (userId, userList) => {
    addUser(userId, socket.id);
    // userList.map((user) => {
    //   if (users.includes(user)) {
    //     usersOnlineStatus.push({
    //       user,
    //       stat: "online",
    //     });
    //   } else {
    //     usersOnlineStatus.push({
    //       user,
    //       stat: "offline",
    //     });
    //   }
    // });
    // console.log(usersOnlineStatus);
    io.emit("getUsers", users);
  });

  //send and get message
  try {
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      if (user == undefined) {
        console.log("partner not connected");
      } else {
        io.to(user.socketId).emit("getMessage", {
          senderId,
          text,
        });
      }
    });
  } catch (e) {
    console.log("hola", e);
  }

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
