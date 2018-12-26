// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemWebsocket = CES.System.extend({
  update: function() {
    const websocket_entities = this.world.getEntities("Websocket");
    if(0 === websocket_entities.length) {
      return;
    }

    const websocket_comp = websocket_entities[0].getComponent("Websocket");
    if(!websocket_comp.socket) {
      websocket_comp.socket = new WebSocket("ws:\\localhost:8989");
      //websocket_comp.socket = new WebSocket("ws:\\192.168.219.126:8989");
      websocket_comp.socket.onopen = () => {
        console.log("On connect websocket.");
      };
      websocket_comp.socket.onclose = () => {
        console.log("On disconnect websocket.");
      };

      websocket_comp.socket.onmessage = event => {
        if(event.data.indexOf/*Is string message.*/) {
          if(-1 !== event.data.indexOf("Connect:")) {
            websocket_comp.connect_buffer[websocket_comp.connect_buffer.length] = Number(event.data.slice(event.data.indexOf(":") + 1));
          }
          else if(-1 !== event.data.indexOf("Disconnect:")) {
            websocket_comp.disconnect_buffer[websocket_comp.disconnect_buffer.length] = Number(event.data.slice(event.data.indexOf(":") + 1));
          }
        }
        else /*Is blob message.*/ {
          websocket_comp.blob_buffer[websocket_comp.blob_buffer.length] = event.data;
        }
      };
    }
  },
});
