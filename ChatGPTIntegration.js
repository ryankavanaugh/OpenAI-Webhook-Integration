const cors = require("cors");
const port = process.env.PORT || 80;
const express = require("express")
const app = express();
const OpenAI = require("openai");
const openai = new OpenAI();


const StreamChat = require('stream-chat').StreamChat;

// Middleware
app.use(cors());

// This is where all of the main code is executed
app.post("/", (req, res) => {
  let body="";
  req.on("data", (chunk) => {
  body+=chunk;
  });

    // Payload from Stream Webhook
    req.on("end", async () => {
    let parsedBody = JSON.parse(body);
    if(parsedBody.message==undefined){ 
        return
    }

    // Create variables for message text, channelID/type, & user sending the message
      const incomingMessage = parsedBody.message.text
      const channelID = parsedBody.channel.id
      const type = parsedBody.channel.type
      const user = parsedBody.message.user.id
    
      // Pring out values for confirmation/debugging
      console.log(incomingMessage)
      console.log(channelID)
      console.log(user)
      
     // Send GPT the message and provide the response to the user
    try {
      // Confirming the message was sent by the user
      if (user == "Adam") {

        // Initialize Chat & fetch the channel
        const client = StreamChat.getInstance('nvp9bux7jbb8','4srf6hpg2q8udqssevzekb6b8fq5a9ahtyxdm3b5bsktb4hpe479j6cfwjggx96m');
        const channel = client.channel(type, channelID, {})
      
        // Send GPT the user's message
        const GPTResponse = await openai.chat.completions.create({
          messages: [{ role: "system", content: incomingMessage }],
          model: "gpt-3.5-turbo",
        });
      
      // Separate out GPT's reponse from other data fields
      console.log(GPTResponse.choices[0].message.content);
      let messageResponse = GPTResponse.choices[0].message.content

      // Send the GPT response back to the user  
        const gptmessage = {
          text: messageResponse,
          user_id: "Gwen"
          };
        channel.sendMessage(gptmessage);
      
      // Typing Events
      await channel.keystroke();
      // Sends the typing.stop event 
      await channel.stopTyping();
      }
    }
    catch (error) {
    console.log(error);
    }
    res.status(200).send("OK");
  });
});


app.listen(port, () => {
  console.log(`server running on port ${port}`);
  });
