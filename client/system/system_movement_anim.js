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
    const player_memory = this.player_memory;
    this.world.getEntities("Player", "Pos", "Rot", "Anim").forEach(entity => {
      const pos = entity.getComponent("Pos").pos;
      const rot = entity.getComponent("Rot").rot;
      const anim_comp = entity.getComponent("Anim");

      if(true === player_memory.is_first) {
        player_memory.is_first = false;
        glMatrix.vec3.copy(player_memory.pos, pos);
      }
      else {
        const dist = glMatrix.vec3.distance(player_memory.pos, pos);
        if(0.1 >= dist) {
          anim_comp.state = "idle";
        }
        else {
          if(player_memory.pos[0] > pos[0]) {
            glMatrix.quat.rotateY(rot, IDENTITY_QUAT, glMatrix.glMatrix.toRadian(180));
          }
          else if(player_memory.pos[0] < pos[0]){
            glMatrix.quat.copy(rot, IDENTITY_QUAT);
          }

          anim_comp.state = "run";
          glMatrix.vec3.copy(player_memory.pos, pos);
        }
      }
    });
  },
});
