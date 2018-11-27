// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemViewport = CES.System.extend({
  update: function() {
    const half_w = CANVAS_W * 0.5;
    const half_h = CANVAS_H * 0.5;

    this.world.getEntities("Viewport").forEach(function(entity) {
      const viewport = entity.getComponent("Viewport");

      vec3.add(viewport.target, viewport.pos, viewport.dir);
      mat4.targetTo(viewport.transform_view, viewport.pos, viewport.target, viewport.up);

      viewport.width = CANVAS_W;
      viewport.height = CANVAS_H;
      mat4.ortho(viewport.transform_projection, -half_w, half_w, -half_h, half_h, viewport.z_near, viewport.z_far);

      mat4.multiply(viewport.transform_vp, viewport.transform_view, viewport.transform_projection);
    })
  },
});
