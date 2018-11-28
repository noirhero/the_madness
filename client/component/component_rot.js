// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentRot = CES.Component.extend({
  name: "Rot",
  init: function(x_degree, y_degree, z_degree) {
    this.rot = quat.fromEuler(x_degree || 0, y_degree || 0, z_degree || 0);
  },
});
