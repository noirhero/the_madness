// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemSpawn = CES.System.extend({
  update: function() {
    this.world.getEntities("Spawner").forEach(entity => {
      const spawn_comp = entity.getComponent("Spawner");
      if(true === spawn_comp.is_spawn || "None" == spawn_comp.entity_name) {
        return;
      }

      spawn_comp.is_spawn = true;

      ReadFile("data/" + spawn_comp.entity_name + ".json", entity_text => {
        const load_entity = EntityLoad(JSON.parse(entity_text));
        if(load_entity) {
          const entity_pos_comp = load_entity.getComponent("Pos");
          if(entity_pos_comp) {
            const spawn_pos = entity.getComponent("Pos").pos;
            entity_pos_comp.pos[0] = spawn_pos[0];
            entity_pos_comp.pos[1] = spawn_pos[1];
          }

          this.world.addEntity(load_entity);
        }
      });
    });
  },
});
