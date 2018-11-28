// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentScale = CES.Component.extend({
  name: "Scale",
  init: function(x, y, z) {
    this.scale = vec3.fromValues(x || 1, y || 1, z || 1);
  },
});
