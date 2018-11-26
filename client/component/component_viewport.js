// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentViewport = CES.Component.extend({
  name: "Viewport",
  init: function(x, y, z) {
    this.pos = vec3.fromValues(x || 0, y || 0, z || 0);
    this.dir = vec3.fromValues(0.0, 0.0, -1.0);
    this.up = vec3.fromValues(0.0, 1.0, 0.0);
    this.target = vec3.create();
    this.transform_view = mat4.create();

    this.width = 0;
    this.height = 0;
    this.z_near = -1000;
    this.z_far = 1000;
    this.transform_projection = mat4.create();

    this.transform_vp = mat4.create();
  },
});
