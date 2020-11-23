const express = require("express");
const bodyparser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

// LowDb
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const { json } = require("body-parser");
const adapter = new FileSync("./database.json");
const db = low(adapter);

const app = express();
app.use(cors());

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

// functions

const getMessages = (req, res) => {
  const message = getMessages();
  res.send(message);
};

const getMessageWitId = (req, res) => {
  const message = getMessages();
  const resultArray = message.filter((item) => {
    if (item.id == req.params.id) {
      return true;
    }
  });
  res.send(resultArray);
};

const postMessageSave = (req, res) => {
  if (req.body.from == "") {
    res.status(400).send("Form is not provided");
  }

  if (req.body.text == "") {
    res.status(400).send("Text is not provided");
  }

  if (req.body.from != "" && req.body.text != "") {
    const message = getMessages();
    const newMessage = req.body;
    newMessage.id = message.length;
    newMessage.timeSent = new Date();
    message.push(req.body);
    saveMessages(message);
    res.send(newMessage);
  }
};

const deleteMessage = (req, res) => {
  const message = getMessages();
  const messagetoDeleteId = req.params.id;

  const resultArray = message.filter((item) => {
    if (item.id != messagetoDeleteId) {
      return true;
    }
  });

  saveMessages(resultArray);
  res.send(resultArray);
};

const getLastMessage = (req, res) => {
  const message = getMessages();
  resultArray = message.slice(0, 10);

  res.send(resultArray);
};

const getMessagesSearch = (req, res) => {
  const txtToSearch = req.query.text;
  const message = getMessages();
  const resultOfArray = message.filter((item) => {
    if (item.text.includes(txtToSearch)) {
      return true;
    }
  });

  res.send(resultOfArray);
};

const getMessages = () => {
  const rawdata = fs.readFileSync("db.json");
  return JSON.parse(rawdata);
};

const saveMessages = (quotes) => {
  let data = JSON.stringify(quotes);
  fs.writeFileSync("db.json", data);
};

// Api
app.use(bodyparser.urlencoded());
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/message", getMessages);
app.get("/message/latest", getLastMessage);
app.get("/message/search", getMessagesSearch);
app.post("/message", postMessageSave);
app.delete("/message/:messageId", deleteMessage);

app.listen(3000);
