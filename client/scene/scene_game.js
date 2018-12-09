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
      });

      scene_data.entites.forEach(entity_url => {
        ReadFile(entity_url, entity_text => {
          const load_entity = EntityLoad(JSON.parse(entity_text));
          if(load_entity) {
            world.addEntity(load_entity);
          }
        });
      });
    });
  }
}
