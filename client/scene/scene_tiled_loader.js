// Copyright 2018 TAP, Inc. All Rihgts Reserved.

function SceneTiledLoad(world, tiled_scene_obj) {
  "use strict";

  tiled_scene_obj.forEach(entity_obj => {
    const load_entity = EntityLoad(entity_obj);
    if(load_entity) {
      world.addEntity(load_entity);
    }
  });
}
