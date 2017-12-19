const express = require("express");
const bodyParser = require("body-parser");
//add require for express-session and dotenv
const session = require("express-session");
require("dotenv").config();
const filter = require(`${__dirname}/middlewares/filter`);

const mc = require(`${__dirname}/controllers/messages_controller`);
const createInitialSession = require(`${__dirname}/middlewares/session`);

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../build`));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 10000
    }
  })
);
app.use(createInitialSession);
app.use((req, res, next) => {
  const { method } = req;
  if (method === "POST" || method === "PUT") {
    filter(req, res, next);
  } else {
    next();
  }
});
const messagesBaseUrl = "/api/messages";
app.post(messagesBaseUrl, mc.create);
app.get(messagesBaseUrl, mc.read);
app.put(`${messagesBaseUrl}`, mc.update);
app.delete(`${messagesBaseUrl}`, mc.delete);
app.get(`${messagesBaseUrl}/history`, mc.history);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
