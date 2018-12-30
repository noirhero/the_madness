// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemMovementNetPlayer = CES.System.extend({
  init: function() {
    this.direction = glMatrix.vec3.create();
  },
  update: function(delta) {
    const websocket_entities = this.world.getEntities("Websocket");
    if(0 === websocket_entities.length) {
      return;
    }

    const sync_buffer = websocket_entities[0].getComponent("Websocket").sync_buffer;
    let sync_data = sync_buffer.shift();
    while(sync_data) {
      const sync_id = sync_data.id;
      const sync_pos = [sync_data.x, sync_data.y, 0];

      let net_player_entity = null;
      this.world.getEntities("NetPlayer", "Pos").some(entity => {
        if(sync_data.id === entity.getComponent("NetPlayer").id) {
          net_player_entity = entity;
          return true;
        }
        return false;
      });

      if(!net_player_entity) {
        ReadFile("data/entity_hero.json", entity_text => {
          const load_entity = EntityLoad(JSON.parse(entity_text));
          if(load_entity) {
            const pos_comp = load_entity.getComponent("Pos");
            if(pos_comp) {
              const pos = pos_comp.pos;
              pos[0] = sync_pos[0];
              pos[1] = sync_pos[1];
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
        const net_player_comp = net_player_entity.getComponent("NetPlayer");
        glMatrix.vec3.copy(net_player_comp.net_pos, sync_pos);
      }

      sync_data = sync_buffer.shift();
    }

    this.world.getEntities("NetPlayer", "Pos").forEach(entity => {
      const net_player_comp = entity.getComponent("NetPlayer");
      const net_player_pos = entity.getComponent("Pos").pos;

      glMatrix.vec3.sub(this.direction, net_player_comp.net_pos, net_player_pos);
      const length = glMatrix.vec3.length(this.direction);
      if(1 > length) {
        return;
      }

      glMatrix.vec3.scale(this.direction, this.direction, 1 / length);
      glMatrix.vec3.scaleAndAdd(net_player_pos, net_player_pos, this.direction, net_player_comp.speed * delta);
    });
  },
});
