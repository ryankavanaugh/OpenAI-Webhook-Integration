require("dotenv").config();
const express = require("express");
const cors = require("cors");

const axios = require("axios");
const app = express();
const port = process.env.PORT || 5000;

//chat client

//middleware
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send("OK");
})

app.post("/", (req, res) => {
  console.log('hit the webhook')
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    let parsedBody = JSON.parse(body);
    console.log(parsedBody);
    if (parsedBody.type === "message.new") {
      console.log(parsedBody);
    }
    res.status(200).send("OK");
  });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
