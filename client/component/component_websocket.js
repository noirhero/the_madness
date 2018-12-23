// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentWebsocket = CES.Component.extend({
  name: "Websocket",
  init: function() {
    this.socket = null;
    this.connect_buffer = [];
    this.disconnect_buffer = [];
    this.sync_buffer = [];
    this.blob_buffer = [];
  },
});
