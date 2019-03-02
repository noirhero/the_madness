// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const ComponentRot = CES.Component.extend({
  name: "Rot",
  init: function(x_degree, y_degree, z_degree) {
    this.rot = glMatrix.quat.fromEuler(glMatrix.quat.create(), x_degree || 0, y_degree || 0, z_degree || 0);
  },
});
