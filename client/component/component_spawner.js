// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const ComponentSpawner = CES.Component.extend({
  name: "Spawner",
  init: function(type, entity_name) {
    this.type = type || "None";
    this.entity_name = entity_name || "None";
    this.is_spawn = false;
  },
});
