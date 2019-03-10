// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemInstancingBuild = CES.System.extend({
  update: function() {
    const world = this.world;
    const world_transform = glMatrix.mat4.create();
    const world_pos = glMatrix.vec3.create();

    world.getEntities("InstancingBuild").forEach(entity => {
      const build_comp = entity.getComponent("InstancingBuild");
      const check_box = (new SAT.Box(new SAT.V(build_comp.x, build_comp.y), build_comp.w, build_comp.h)).toPolygon();

      const instancing_comp = new ComponentInstancing();
      world.getEntities("Scale", "Pos", "Texture", "Texcoord").forEach(mesh_entity => {
        if(mesh_entity.getComponent("Player")) {
          return;
        }

        const pos = mesh_entity.getComponent("Pos").pos;
        if(false === SAT.pointInPolygon(new SAT.V(pos[0], pos[1]), check_box)) {
          return;
        }

        const tex_coord = mesh_entity.getComponent("Texcoord").values;
        const texture = mesh_entity.getComponent("Texture").texture;
        if(0 === instancing_comp.subsets.length) {
          instancing_comp.subsets[instancing_comp.subsets.length] = {
            vertices: [],
            textures: [texture],
            vb: null,
          };
        }

        let subset = instancing_comp.subsets[instancing_comp.subsets.length - 1];
        if(subset.vertices.length >= (NUM_BATCH * 6/*xyz uv ti*/ * 4/*quad*/)) {
          subset = instancing_comp.subsets[instancing_comp.subsets.length] = {
            vertices: [],
            textures: [texture],
            vb: null,
          };
        }

        let texture_idx = 0;
        if(false === subset.textures.some(i => {
          if(i === texture) {
            return true;
          }

          ++texture_idx;
          return false;
        })) {
          if(LIMIT_TEXTURE === subset.textures.length) {
            texture_idx = 0;
            subset = instancing_comp.subsets[instancing_comp.subsets.length] = {
              vertices: [],
              textures: [texture],
              vb: null,
            };
          }
          else {
            texture_idx = subset.textures.length;
            subset.textures[subset.textures.length] = texture;
          }
        }

        const scale = mesh_entity.getComponent("Scale").scale;
        const rot = mesh_entity.getComponent("Rot") ? mesh_entity.getComponent("Rot").rot : IDENTITY_QUAT;
        glMatrix.mat4.fromRotationTranslationScale(world_transform, rot, pos, scale);

        const vertices = subset.vertices;
        for(let i = 0; i < 4; ++i) {
          glMatrix.vec3.transformMat4(world_pos, QUAD_LOCAL_POS[i], world_transform);

          vertices[vertices.length] = world_pos[0];
          vertices[vertices.length] = world_pos[1];
          vertices[vertices.length] = pos[2];
          vertices[vertices.length] = tex_coord[i][0];
          vertices[vertices.length] = tex_coord[i][1];
          vertices[vertices.length] = texture_idx;
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
