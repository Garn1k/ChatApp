// External modules ------------------------------------------------------------
const http = require("http");
const path = require("path");
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
// External modules ------------------------------------------------------------


// Internal modules ------------------------------------------------------------
const router = require("./src/router");
const logger = require("./logger");
const { port } = require("./src/variables.config");
const { postData, getMessageList, deleteMessages} = require("./src/controller");
// Internal modules ------------------------------------------------------------


// Initializing Express application and HTTP server ----------------------------
const app = express();
const server = http.createServer(app);
const io = new Server(server);
// Initializing Express application and HTTP server ----------------------------


// Middleware for serving static files -----------------------------------------
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploadImage", express.static("uploads/images"));
app.use("/uploadGif", express.static("uploads/gif"));
app.use("/uploadVideo", express.static("uploads/videos"));
// Middleware for serving static files -----------------------------------------


// Middleware configuration ----------------------------------------------------
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
  }));
app.use(morgan("dev"));
app.use(express.json());
// Middleware configuration ----------------------------------------------------



// Using the custom router for handling application routes ---------------------
app.use(router);


// Real-time communication using Socket.IO -------------------------------------
let socketsConnected = new Set();
let list = [];

io.on("connection", (socket) => {
  logger.info("Socket connected", socket.id);
  socketsConnected.add(socket.id);
  io.emit("clients-total", socketsConnected.size);

  const messageList = getMessageList();
  messageList.then((data) => list = data);

  socket.emit("all-messages", list);
  
  socket.on("message", (data) => {
    logger.info("Received data", data);
    io.emit("chat-message", data);
    postData(data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });

  socket.on("disconnect", () => {
    logger.info("Socket disconnected", socket.id);
    socketsConnected.delete(socket.id);
    io.emit("clients-total", socketsConnected.size);
    if(socketsConnected.size == 0){
      deleteMessages();
    }
  });

});
// Real-time communication using Socket.IO -------------------------------------


// Starting the server ---------------------------------------------------------
server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
