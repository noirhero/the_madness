// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemViewport = CES.System.extend({
  update: function() {
    this.world.getEntities("Viewport").forEach(function(entity) {
      const viewport = entity.getComponent("Viewport");

      glMatrix.vec3.add(viewport.target, viewport.pos, viewport.dir);
      glMatrix.mat4.lookAt(viewport.transform_view, viewport.pos, viewport.target, viewport.up);

      viewport.width = CANVAS_W;
      viewport.height = CANVAS_H;
      glMatrix.mat4.ortho(viewport.transform_projection, 0, CANVAS_W, 0, CANVAS_H, viewport.z_near, viewport.z_far);

      glMatrix.mat4.multiply(viewport.transform_vp, viewport.transform_projection, viewport.transform_view);
    })
  },
});
