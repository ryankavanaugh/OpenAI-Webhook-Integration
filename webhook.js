require("dotenv").config();
const express = require("express");
const cors = require("cors");

const axios = require("axios");
const app = express();
const port = process.env.PORT || 5000;

const encoded = base64.encode(
  "stephen@getstream.io/token:rQ2CCFPefNFOGwaHKbmH4ngCCl9kbSAjPbWeBDUN"
);

const startingURL = "https://getstream.zendesk.com/api/v2/tickets/";

//chat client
const StreamChat = require("stream-chat").StreamChat;
const chatClient = StreamChat.getInstance(
  "qtc55pny5xww",
  "9hrptm6edfg8ygm6hzswpj8rnze94v8ujfmg7drfk8ndaztnqkh875upke6ndypc"
);

//middleware
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.post("/", (req, res) => {
  console.log("hit the webhook");
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", async () => {
    let parsedBody = JSON.parse(body);
    if (parsedBody.type === "channel.updated") {
      const { channel_type, channel_id } = parsedBody;
      const channel = chatClient.channel(channel_type, channel_id);
      const state = await channel.query({ messages: { limit: 40 } });
      const { messages } = state;
      const lines = "";
      messages.forEach((mes) => (lines += `${mes.text} - ${mes.user.id} \n`));
      console.log(lines);
      const raw = await fetch(`https://getstream.zendesk.com/api/v2/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encoded}`,
        },
        body: {
          ticket: {
            comment: {
              body: lines,
            },
            priority: "normal",
            subject: "New Dispute",
          },
        },
      });
    }
    res.status(200).send("OK");
  });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
