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
        else if("spawn_player" == system_text) {
          world.addSystem(new SystemSpawnPlayer());
        }
        else if("websocket" == system_text) {
          world.addSystem(new SystemWebsocket());
        }
      });
      world.addSystem(new SystemMovementKeyboard());
      world.addSystem(new SystemMovementCollisionDetection());
      world.addSystem(new SystemMovementAnim());
      world.addSystem(new SystemMovementSend());
      world.addSystem(new SystemMovementNetPlayer());
      world.addSystem(new SystemCamera());
      world.addSystem(new SystemBGM());
      //world.addSystem(new SystemDebugDrawCollisionDetection());

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
