// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentSpawner = CES.Component.extend({
  name: "Spawner",
  init: function(name) {
    this.type = name || "None";
  },
});
