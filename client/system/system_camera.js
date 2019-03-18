// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemCamera = CES.System.extend({
  init: function() {
    this.player_pos = new SAT.V();
  },
  update: function(delta) {
    const world = this.world;
    const player_pos = this.player_pos;

    if(false === world.getEntities("Player", "Pos").some(entity => {
      const pos = entity.getComponent("Pos").pos;
      player_pos.x = pos[0];
      player_pos.y = pos[1];
      return true;
    })) {
      return;
    }

    let viewport = null;
    if(false === world.getEntities("Viewport").some(entity => {
      viewport = entity.getComponent("Viewport");
      return true;
    })) {
      return;
    }

    world.getEntities("Camera", "Pos", "Scale", "Bounding").every(entity => {
      const bounding_comp = entity.getComponent("Bounding");
      if(!bounding_comp.data) {
        const pos = entity.getComponent("Pos").pos;
        const scale = entity.getComponent("Scale").scale;
        bounding_comp.data = new SAT.Box(new SAT.V(pos[0] - scale[0] * 0.5, pos[1] - scale[1] * 0.5), scale[0], scale[1]).toPolygon();
      }

      if(false === SAT.pointInPolygon(player_pos, bounding_comp.data)) {
        return true;
      }

      const camera_comp = entity.getComponent("Camera");
      glMatrix.vec3.lerp(viewport.pos, viewport.pos, [player_pos.x, player_pos.y, viewport.pos[2]], camera_comp.speed * delta);
      return false;
    });
  },
});
