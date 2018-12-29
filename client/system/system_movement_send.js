// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemMovementSend = CES.System.extend({
  init: function() {
    this.send_time = 0;
    this.send_pos = glMatrix.vec3.create();
  },
  update: function() {
    const now = Date.now();
    const delta = now - this.send_time;
    if(334 > delta) {
      return;
    }

    const player_entites = this.world.getEntities("Player", "Pos");
    if(0 === player_entites.length) {
      return;
    }

    const player_pos = player_entites[0].getComponent("Pos").pos;
    const dist = glMatrix.vec3.dist(player_pos, this.send_pos);
    if(0.1 > dist) {
      return;
    }

    const websocket_entities = this.world.getEntities("Websocket");
    if(0 === websocket_entities.length) {
      return;
    }

    const websocket_comp = websocket_entities[0].getComponent("Websocket");
    if(!websocket_comp.socket) {
      return;
    }

    websocket_comp.socket.send(JSON.stringify({
      id: player_entites[0].getComponent("Player").id,
      x: player_pos[0],
      y: player_pos[1],
    }, null, " "));
    this.send_time = now;
    glMatrix.vec3.copy(this.send_pos, player_pos);
  },
});
