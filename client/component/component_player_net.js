// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentPlayerNet = CES.Component.extend({
  name: "NetPlayer",
  init: function(id, pos) {
    this.id = id;
    this.speed = 100;
    this.net_pos = pos || glMatrix.vec3.create();
  },
});
