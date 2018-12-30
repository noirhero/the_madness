// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemCamera = CES.System.extend({
  init: function() {
    this.player_pos = new SAT.V();
  },
  update: function(delta) {
    const viewport_entites = this.world.getEntities("Viewport");
    if(0 === viewport_entites.length) {
      return;
    }

    const viewport_comp = viewport_entites[0].getComponent("Viewport");

    const player_entities = this.world.getEntities("Player", "Pos");
    if(0 === player_entities.length) {
      return;
    }

    const player_pos = player_entities[0].getComponent("Pos").pos;
    this.player_pos.x = player_pos[0];
    this.player_pos.y = player_pos[1];

    this.world.getEntities("Camera", "Pos", "Scale", "Bounding").some(entity => {
      const bounding_comp = entity.getComponent("Bounding");
      if(!bounding_comp.data) {
        const pos = entity.getComponent("Pos").pos;
        const scale = entity.getComponent("Scale").scale;
        bounding_comp.data = new SAT.Box(new SAT.V(pos[0] - scale[0] * 0.5, pos[1] - scale[1] * 0.5), scale[0], scale[1]).toPolygon();
      }

      if(false === SAT.pointInPolygon(this.player_pos, bounding_comp.data)) {
        return false;
      }

      const inv_double_width = -1 / CANVAS_W * 2;
      const inv_double_height = -1 / CANVAS_H * 2;

      const camera_comp = entity.getComponent("Camera");
      camera_comp.pos[0] = viewport_comp.pos[0] / inv_double_width;
      camera_comp.pos[1] = viewport_comp.pos[1] / inv_double_height;

      glMatrix.vec3.lerp(camera_comp.pos, camera_comp.pos, player_pos, camera_comp.speed * delta);
      viewport_comp.pos[0] = camera_comp.pos[0] * inv_double_width;
      viewport_comp.pos[1] = camera_comp.pos[1] * inv_double_height;

      return true;
    });
  },
});
