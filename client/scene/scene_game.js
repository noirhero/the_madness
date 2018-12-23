// Copyright 2018 TAP, Inc. All Rihgts Reserved.

class GameScene extends Scene {
  constructor(url) {
    super();

    const world = this.world_;
    ReadFile(url, json_text => {
      const scene_data = JSON.parse(json_text);

      scene_data.systems.forEach(system_text => {
        if("animation" == system_text) {
          world.addSystem(new SystemAnimation());
        }
        else if("render_sprite" == system_text) {
          world.addSystem(new SystemRenderSprite());
        }
        else if("viewport" == system_text) {
          world.addSystem(new SystemViewport());
        }
        else if("record" == system_text) {
          world.addSystem(new SystemRecordKeyboard());
        }
        else if("spawn" == system_text) {
          world.addSystem(new SystemSpawn());
        }
      });

      scene_data.entities.forEach(entity_url => {
        ReadFile(entity_url, entity_text => {
          const load_entity = EntityLoad(JSON.parse(entity_text));
          if(load_entity) {
            world.addEntity(load_entity);
          }
        });
      });

      if(scene_data.tiled) {
        ReadFile(scene_data.tiled, tiled_scene_text => {
          SceneTiledLoad(world, JSON.parse(tiled_scene_text));
        });
      }

      this.next_scene_ = scene_data.next;
    });
  }
}
