// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemMovementAnim = CES.System.extend({
  init: function() {
    this.player_memory = {
      is_first: true,
      pos: glMatrix.vec3.create(),
    };

    this.net_player_memories = [];
  },
  update: function() {
    const process_fn = (memory, entity) => {
      const pos = entity.getComponent("Pos").pos;
      const rot = entity.getComponent("Rot").rot;
      const anim_comp = entity.getComponent("Anim");

      if(true === memory.is_first) {
        memory.is_first = false;
        glMatrix.vec3.copy(memory.pos, pos);
      }
      else {
        const dist = glMatrix.vec3.distance(memory.pos, pos);
        if(0.1 >= dist) {
          anim_comp.state = "idle";
        }
        else {
          if(memory.pos[0] > pos[0]) {
            glMatrix.quat.rotateY(rot, IDENTITY_QUAT, RAD_180);
          }
          else if(memory.pos[0] < pos[0]){
            glMatrix.quat.copy(rot, IDENTITY_QUAT);
          }

          anim_comp.state = "run";
          glMatrix.vec3.copy(memory.pos, pos);
        }
      }
    };

    const player_memory = this.player_memory;
    this.world.getEntities("Player", "Pos", "Rot", "Anim").forEach(entity => {
      process_fn(player_memory, entity);
    });

    const net_player_memories = this.net_player_memories;
    this.world.getEntities("NetPlayer", "Pos", "Rot", "Anim").forEach(entity => {
      const net_player_id = entity.getComponent("NetPlayer").id;
      if(!net_player_memories[net_player_id]) {
        net_player_memories[net_player_id] = {
          is_first: false,
          pos: glMatrix.vec3.create(),
        };
      }

      process_fn(net_player_memories[net_player_id], entity);
    });
  },
});
