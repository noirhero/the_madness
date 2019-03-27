// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemMovementNetPlayer = CES.System.extend({
  init: function() {
    this.direction = glMatrix.vec3.create();
  },
  update: function(delta) {
    const world = this.world;

    let sync_buffer = null;
    if(false === world.getEntities("Websocket").some(entity => {
      sync_buffer = entity.getComponent("Websocket").sync_buffer;
      return true;
    })) {
      return;
    }

    let sync_data = sync_buffer.shift();
    while(sync_data) {
      const sync_id = sync_data.id;
      const x = sync_data.x;
      const y = sync_data.y;

      let net_player_entity = null;
      if(false === world.getEntities("NetPlayer", "Pos").some(entity => {
        if(sync_data.id === entity.getComponent("NetPlayer").id) {
          net_player_entity = entity;
          return true;
        }
        return false;
      })) {
        ReadFile("data/entity_hero.json", entity_text => {
          const load_entity = EntityLoad(JSON.parse(entity_text));
          if(load_entity) {
            const pos_comp = load_entity.getComponent("Pos");
            if(pos_comp) {
              const pos = pos_comp.pos;
              pos[0] = x;
              pos[1] = y;
              load_entity.addComponent(new ComponentPlayerNet(sync_id, glMatrix.vec3.fromValues(pos[0], pos[1], pos[2])));
            }
            else {
              load_entity.addComponent(new ComponentPlayerNet(sync_id));
            }

            this.world.addEntity(load_entity);
          }
        });
      }
      else {
        const net_pos = net_player_entity.getComponent("NetPlayer").net_pos;
        net_pos[0] = x;
        net_pos[1] = y;
      }

      sync_data = sync_buffer.shift();
    }

    const direction = this.direction;
    world.getEntities("NetPlayer", "Pos").forEach(entity => {
      const net_player_comp = entity.getComponent("NetPlayer");
      const net_player_pos = entity.getComponent("Pos").pos;

      glMatrix.vec3.sub(direction, net_player_comp.net_pos, net_player_pos);
      const length = glMatrix.vec3.length(direction);
      if(1 > length) {
        return;
      }

      glMatrix.vec3.scale(direction, direction, 1 / length);
      glMatrix.vec3.scaleAndAdd(net_player_pos, net_player_pos, direction, net_player_comp.speed * delta);
    });
  },
});
