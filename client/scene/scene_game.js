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
        else if("postprocess_begin" == system_text) {
          world.addSystem(new SystemPostprocessBegin());
        }
        else if("render_sprite" == system_text) {
          world.addSystem(new SystemRenderSprite());
          world.addSystem(new SystemRenderInstancing());
          //world.addSystem(new SystemDebugDrawCollisionDetection());
        }
        else if("record_button" == system_text) {
          world.addSystem(new SystemRecordButton());
        }
        else if("postprocess_end" == system_text) {
          world.addSystem(new SystemPostprocessEnd());
        }
        else if("viewport" == system_text) {
          world.addSystem(new SystemViewport());
        }
        else if("record" == system_text) {
          if("ontouchstart" in document.documentElement) {
            world.addSystem(new SystemRecordTouch());
          }
          else {
            world.addSystem(new SystemRecordKeyboard());
          }
          world.addSystem(new SystemRecordPlay());
        }
        else if("spawn" == system_text) {
          world.addSystem(new SystemSpawn());
        }
        else if("spawn_player" == system_text) {
          world.addSystem(new SystemSpawnPlayer());
          world.addSystem(new SystemDespawnNetPlayer());
        }
        else if("websocket" == system_text) {
          world.addSystem(new SystemWebsocket());
        }
        else if("movement" == system_text) {
          world.addSystem(new SystemMovementKeyboard());
          world.addSystem(new SystemMovementTouch());
          world.addSystem(new SystemMovementCollisionDetection());
          world.addSystem(new SystemMovementAnim());
          world.addSystem(new SystemMovementSend());
          world.addSystem(new SystemMovementNetPlayer());
        }
        else if("camera" == system_text) {
          world.addSystem(new SystemCamera());
        }
        else if("bgm" == system_text) {
          world.addSystem(new SystemBGM());
        }
        else if("madness" == system_text) {
          world.addSystem(new SystemMadness());
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
