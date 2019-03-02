// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const ComponentPos = CES.Component.extend({
  name: "Pos",
  init: function(x, y, z) {
    this.pos = glMatrix.vec3.fromValues(x || 0, y || 0, z || 0);
  },
});
