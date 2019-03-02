// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemInstancingBuild = CES.System.extend({
  update: function() {
    const world = this.world;
    const instancing_comp = new ComponentInstancing();

    world.getEntities("InstancingBuild").forEach(entity => {
      const build_comp = entity.getComponent("InstancingBuild");
      const check_box = (new SAT.Box(new SAT.V(build_comp.x, build_comp.y), build_comp.w, build_comp.h)).toPolygon();

      world.getEntities("Scale", "Pos", "Texture", "Texcoord").forEach(mesh_entity => {
        if(mesh_entity.getComponent("Player")) {
          return;
        }

        const pos = mesh_entity.getComponent("Pos").pos;
        if(false === SAT.pointInPolygon(new SAT.V(pos[0], pos[1]), check_box)) {
          return;
        }

        const scale = mesh_entity.getComponent("Scale").scale;
        const rot = mesh_entity.getComponent("Rot") ? mesh_entity.getComponent("Rot").rot : IDENTITY_QUAT;
        const texture = mesh_entity.getComponent("Texture").texture;

        let subset = null;
        if(0 === instancing_comp.subsets.length) {
          subset = instancing_comp.subsets[instancing_comp.subsets.length] = {};
        }
        else {
          subset = instancing_comp.subsets[instancing_comp.subsets.length];
        }

        world.removeEntity(mesh_entity);
      });

      if(0 < instancing_comp.subsets.length) {
        const instancing_entity = new CES.Entity();
        instancing_entity.addComponent(instancing_comp);
        world.addEntity(instancing_entity);
      }

      world.removeEntity(entity);
    });
  }
});
