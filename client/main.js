// Copyright 2018 TAP, Inc. All Rights Reserved.

function Main() {
  "use strict";

  const socket = new WebSocket("ws:\\localhost:8989");
  socket.onopen = function(event) {
    console.log("Connect.");
    socket.send("Hi, server.");
  };

  socket.onmessage = function(event) {
    console.log(event.data);
  };

  socket.onclose = function(event) {
    console.log("Disconnect.");
  };
}
