// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemSpawnPlayer = CES.System.extend({
  update: function() {
    let player_spawn_entity = null;
    this.world.getEntities("Spawner", "Pos").some(entity => {
      const spawner_comp = entity.getComponent("Spawner");
      if("player_start" == spawner_comp.type) {
        player_spawn_entity = entity;
        return true;
      }
      return false;
    });

    if(!player_spawn_entity) {
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

    const connect_id = websocket_comp.connect_buffer.shift();
    if(undefined === connect_id) {
      return;
    }

    ReadFile("data/entity_hero.json", entity_text => {
      const load_entity = EntityLoad(JSON.parse(entity_text));
      if(load_entity) {
        const player_pos_comp = load_entity.getComponent("Pos");
        const player_scale_comp = load_entity.getComponent("Scale");
        if(player_pos_comp && player_scale_comp) {
          const spawn_pos = player_spawn_entity.getComponent("Pos").pos;
          player_pos_comp.pos[0] = spawn_pos[0];
          player_pos_comp.pos[1] = spawn_pos[1] + player_scale_comp.scale[1] * 0.5;
        }

        load_entity.addComponent(new ComponentPlayer(connect_id));
        this.world.addEntity(load_entity);
      }
    });
  }
});
