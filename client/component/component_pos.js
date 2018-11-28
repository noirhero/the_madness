// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentPos = CES.Component.extend({
  name: "Pos",
  init: function(x, y, z) {
    this.pos = vec3.fromValues(x || 0, y || 0, z || 0);
  },
});
