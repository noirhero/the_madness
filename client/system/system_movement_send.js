// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemMovementSend = CES.System.extend({
  init: function() {
    this.send_time = 0;
    this.send_pos = glMatrix.vec3.create();
  },
  update: function() {
    const now = Date.now();
    const delta = now - this.send_time;
    if(200 > delta) {
      return;
    }

    const world = this.world;

    let websocket_comp = null;
    if(false === world.getEntities("Websocket").some(entity => {
      websocket_comp = entity.getComponent("Websocket");
      return (!websocket_comp.socket) ? false : true;
    })) {
      return;
    }

    const send_pos = this.send_pos;
    let player_pos = null;
    let player_id = null;
    if(false === world.getEntities("Player", "Pos").some(entity => {
      player_pos = entity.getComponent("Pos").pos;
      player_id = entity.getComponent("Player").id;

      const dist = glMatrix.vec3.dist(player_pos, send_pos);
      return (1 > dist) ? false : true;
    })) {
      return;
    }

    websocket_comp.socket.send(JSON.stringify({
      id: player_id,
      x: Math.floor(player_pos[0]),
      y: Math.floor(player_pos[1]),
    }, null, " "));
    this.send_time = now;
    glMatrix.vec3.copy(send_pos, player_pos);
  },
});
