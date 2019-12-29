// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemDespawnNetPlayer = CES.System.extend({
  update: function() {
    const world = this.world;

    let websocket_comp = null;
    if(false === world.getEntities("Websocket").some(entity => {
      websocket_comp = entity.getComponent("Websocket");
      return (!websocket_comp.socket) ? false : true;
    })) {
      return;
    }

    const disconnect_id = websocket_comp.disconnect_buffer.shift();
    world.getEntities("NetPlayer").some(entity => {
      if(disconnect_id === entity.getComponent("NetPlayer").id) {
        world.removeEntity(entity);
        return true;
      }
      return false;
    });
  },
});
