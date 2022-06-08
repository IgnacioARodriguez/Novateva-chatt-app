const router = require("express").Router();
const Message = require("../models/Message");

//add

router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/noRead/:receiverId/:senderId", async (req, res) => {
  try {
    const messages = await Message.find({
      read: false,
      receiver: req.params.receiverId,
      sender: req.params.senderId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/noRead/:receiverId", async (req, res) => {
  try {
    const messages = await Message.find({
      read: false,
      receiver: req.params.receiverId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
