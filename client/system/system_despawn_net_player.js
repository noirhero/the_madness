// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemDespawnNetPlayer = CES.System.extend({
  update: function() {
    const websocket_entities = this.world.getEntities("Websocket");
    if(0 === websocket_entities.length) {
      return;
    }

    const websocket_comp = websocket_entities[0].getComponent("Websocket");
    if(!websocket_comp.socket) {
      return;
    }

    const disconnect_id = websocket_comp.disconnect_buffer.shift();
    let disconnect_net_player_entity = null;

    this.world.getEntities("NetPlayer").some(entity => {
      if(disconnect_id === entity.getComponent("NetPlayer").id) {
        disconnect_net_player_entity = entity;
        return true;
      }
      return false;
    });

    if(disconnect_net_player_entity) {
      this.world.removeEntity(disconnect_net_player_entity);
    }
  },
});
