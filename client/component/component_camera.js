// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentCamera = CES.Component.extend({
  name: "Camera",
  init: function(type) {
    this.type = type || "follow";
    this.speed = 0.1;
    this.pos = glMatrix.vec3.create();
  },
});
