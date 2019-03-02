// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemInstancingBuild = CES.System.extend({
  update: function() {
    const world = this.world;
    this.world.getEntities("InstancingBuild").forEach(entity => {
      world.getEntities("Scale", "Pos", "Texture", "Texcoord").forEach(mesh_entity => {

      });

      world.removeEntity(entity);
    });
  }
});
