// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemSpawnPlayer = CES.System.extend({
  update: function() {
    const websocket_entities = this.world.getEntities("Websocket");
    if(0 === websocket_entities.length) {
      return;
    }

    const websocket_comp = websocket_entities[0].getComponent("Websocket");
    if(!websocket_comp.socket) {
      return;
    }

    const connect_id = websocket_comp.connect_buffer.shift();
    if(undefined === connect_id) {
      return;
    }

    ReadFile("data/entity_hero.json", entity_text => {
      const load_entity = EntityLoad(JSON.parse(entity_text));
      if(load_entity) {
        load_entity.addComponent(new ComponentPlayer(connect_id));
        this.world.addEntity(load_entity);
      }
    });
  }
});
