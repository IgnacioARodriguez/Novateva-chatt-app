const router = require("express").Router();
const Conversation = require("../models/Conversation");
const axios = require("axios");

//new conv

router.post("/", async (req, res) => {
  try {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });

    let conversationExists = await axios.get(
      "http://localhost:8800/api/conversations/find/" +
        req.body.senderId +
        "/" +
        req.body.receiverId
    );
    console.log(conversationExists.data);
    if (conversationExists !== null) {
      console.log("hola");
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } else {
      throw error;
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
