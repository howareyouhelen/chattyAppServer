// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};


function clientNumber(){
  clientSize = {
  type: "clientSize",
  content: wss.clients.size
  }
  wss.clients.forEach(function each(client) {
  client.send(JSON.stringify(clientSize));
  });
}
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  clientNumber();

  ws.onmessage = function (event) {
    const post = JSON.parse(event.data)
    let objPost = {};
    switch(post.type) {
      case "postMessage":
        //handle incoming message
        objPost = {
          type: "incomingMessage",
          id: uuidv4(),
          username: post.username,
          content: post.content
        };
        break;
      case "postNotification":
        //handle incoming notification
        objPost = {
          type: "incomingNotification",
          content: post.content
        }
        break;
      default:
        //show an error in the console if message type is unknown
        throw new Error("Unkown event type" + data.type);
    }
      wss.clients.forEach(function each(client) {
      client.send(JSON.stringify(objPost));
        });
  };


  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    clientNumber();
  });

});




