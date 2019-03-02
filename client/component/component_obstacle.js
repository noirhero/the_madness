// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const ComponentObstacle = CES.Component.extend({
  name: "Obstacle",
  init: function(type) {
    this.type = type || "Box";
    this.data = null;
  },
});
