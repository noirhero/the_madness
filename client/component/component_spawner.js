// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentSpawner = CES.Component.extend({
  name: "Spawner",
  init: function(type) {
    this.type = type || "None";
  },
});
