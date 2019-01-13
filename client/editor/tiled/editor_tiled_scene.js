// Copyright 2018 TAP, Inc. All Rights Reserved.

class EditorTiledScene extends Scene {
  constructor() {
    super();

    const atlaspack_canvas = document.createElement("canvas");
    atlaspack_canvas.width = 256;
    atlaspack_canvas.height = 256;

    const entity = new CES.Entity();
    entity.addComponent(new ComponentPlayer());
    entity.addComponent(new ComponentViewport());
    entity.addComponent(new ComponentPos());
    entity.addComponent(new ComponentScale(32, 32))
    entity.addComponent(new ComponentTexture("../../data/texture/capsule.png"));
    entity.addComponent(new ComponentTexcoord());

    const camera_pos_system = new SystemUpdateCameraPos();

    const world = this.world_;
    world.addSystem(new SystemViewport());
    world.addSystem(new SystemRenderSprite());
    world.addSystem(new SystemUpdateMousePos());
    world.addSystem(new SystemRenderTileObject());
    world.addSystem(camera_pos_system);
    world.addEntity(entity);

    this.entity_ = entity;
    this.camera_pos_system_ = camera_pos_system;
    this.controlKit_ = new ControlKit();
    this.atlaspack_ = window.atlaspack(atlaspack_canvas);
  }

  Initialize() {
    const controlKit = this.controlKit_;
    const world = this.world_;
    const camera_pos_system = this.camera_pos_system_;
    const player_entity = this.entity_;

    const tiled_obj = {
      prev_offset_x: 0,
      offset_x: 0,
      prev_offset_y: 0,
      offset_y: 0,
      prev_scale_x: 1,
      scale_x: 1,
      prev_scale_y: 1,
      scale_y: 1,
    };
    controlKit.addPanel({
      fixed: false,
      label: "Tiled",
    })
      .addSubGroup({
        label: "Offset",
      }).addNumberInput(tiled_obj, "offset_x", {
        onChange: number => {
          world.getEntities("Pos").forEach(entity => {
            const pos = entity.getComponent("Pos").pos;
            pos[0] -= tiled_obj.prev_offset_x;
            pos[0] += number;
          });
          tiled_obj.prev_offset_x = number;
        },
        step: 10,
      }).addNumberInput(tiled_obj, "offset_y", {
        onChange: number => {
          world.getEntities("Pos").forEach(entity => {
            const pos = entity.getComponent("Pos").pos;
            pos[1] -= tiled_obj.prev_offset_y;
            pos[1] += number;
          });
          tiled_obj.prev_offset_y = number;
        },
        step: 10,
      }).addNumberInput(tiled_obj, "scale_x", {
        onChange: number => {
          if(0 === number) {
            return;
          }

          world.getEntities("Scale").forEach(entity => {
            if(player_entity === entity) {
              return;
            }

            const scale = entity.getComponent("Scale").scale;
            scale[0] *= 1 / tiled_obj.prev_scale_x;
            scale[0] *= number;
          });
          tiled_obj.prev_scale_x = number;
        },
      }).addNumberInput(tiled_obj, "scale_y", {
        onChange: number => {
          if(0 === number) {
            return;
          }

          world.getEntities("Pos", "Scale").forEach(entity => {
            if(player_entity === entity) {
              return;
            }

            const pos = entity.getComponent("Pos").pos;
            pos[1] += number * 0.5;

            const scale = entity.getComponent("Scale").scale;
            scale[1] *= 1 / tiled_obj.prev_scale_y;
            scale[1] *= number;
          });
          tiled_obj.prev_scale_y = number;
        },
      })
      .addSubGroup({
        label: "File",
      }).addButton("LOAD", () => {
        const element_load = document.createElement("load");
        element_load.innerHTML = "<input type=\"file\" accept=\".json\">";

        const dialog = element_load.firstChild;
        dialog.addEventListener("change", () => {
          const file = dialog.files[0];
          if (file.name.match(/.json/i)) {
            world.name = file.name;

            world.getEntities().forEach(entity => {
              world.removeEntity(entity);
            });
            world.addEntity(player_entity);

            const reader = new FileReader();
            reader.onload = event => {
              TiledParse(world, event.target.result);
            };
            reader.readAsText(file);
          }
          else {
            alert("File not supported, .json files only");
          }
        });
        dialog.click();
      }).addButton("SAVE", () => {
        const entity_datas = [];
        world.getEntities().forEach(entity => {
          if(player_entity === entity) {
            return;
          }

          const entity_data = {};
          if(entity.getComponent("Pos")) {
            const pos = entity.getComponent("Pos").pos;
            entity_data.pos_comp = {
              x: pos[0], y: pos[1], z: pos[2],
            };
          }
          if(entity.getComponent("Scale")) {
            const scale = entity.getComponent("Scale").scale;
            entity_data.scale_comp = {
              x: scale[0], y: scale[1], z: scale[2],
            };
          }
          if(entity.getComponent("Texcoord")) {
            entity_data.texcoord_comp = {};
            if(EMPTY_TEXCOORD !== entity.getComponent("Texcoord").values) {
              entity_data.texcoord_comp.values = entity.getComponent("Texcoord").values;
            }
          }
          if(entity.getComponent("Texture")) {
            const url = entity.getComponent("Texture").url;
            entity_data.texture_comp = {
              url: url.slice(url.indexOf("data")),
            };
          }
          if(entity.getComponent("Bounding")) {
            entity_data.bounding_comp = {
              type: entity.getComponent("Bounding").type,
            };
          }
          if(entity.getComponent("Spawner")) {
            entity_data.spawner_comp = {
              type: entity.getComponent("Spawner").type,
              entity_name: entity.getComponent("Spawner").entity_name,
            };
          }
          if(entity.getComponent("Sound")) {
            entity_data.sound_comp = {
              file: entity.getComponent("Sound").file,
            };
          }
          if(entity.getComponent("Obstacle")) {
            entity_data.obstacle_comp = {
              type: entity.getComponent("Obstacle").type,
            };
          }
          if(entity.getComponent("Camera")) {
            entity_data.camera_comp = {
              type: entity.getComponent("Camera").type,
            };
          }
          if(entity.getComponent("Madness")) {
            entity_data.madness_comp = {
              type: entity.getComponent("Madness").type,
              value: entity.getComponent("Madness").value,
            };
          }
          entity_datas[entity_datas.length] = entity_data;
        });

        const blob = new Blob([JSON.stringify(entity_datas, null, " ")], {type: "application/json"});

        const element_save = document.createElement("a");
        element_save.href = URL.createObjectURL(blob);
        element_save.download = world.name;
        element_save.click();
      });


    const atlaspack_obj = {
      name: "atlas",
      resolution: this.atlaspack_.canvas.width,
      resolution_presets: [32, 64, 128, 256, 512, 1024, 2048],
    };
    controlKit.addPanel({
      fixed: false,
      label: "Atlas",
      position: [200, 0]
    })
      .addStringInput(atlaspack_obj, "name")
      .addNumberInput(atlaspack_obj, "resolution", {
        presets: atlaspack_obj.resolution_presets,
        onChange: (number) => {
          if(number === this.atlaspack_.canvas.width) {
            return;
          }

          const old_resolution = this.atlaspack_.canvas.width;
          atlaspack_obj.resolution_presets.some((n) => {
            if(number === n) {
              this.atlaspack_.canvas.getContext("2d").clearRect(0, 0, old_resolution, old_resolution);
              this.atlaspack_.canvas.width = this.atlaspack_.canvas.height = number;
              this.atlaspack_ = window.atlaspack(this.atlaspack_.canvas);
              return true;
            }
            return false;
          });
        },
      }).addButton("RESET", () => {
        const resolution = this.atlaspack_.canvas.width;
        this.atlaspack_.canvas.getContext("2d").clearRect(0, 0, resolution, resolution);
      }).addButton("PACK", () => {
        const element_load = document.createElement("load");
        element_load.innerHTML = "<input type=\"file\" accept=\".png\" multiple>";

        const dialog = element_load.firstChild;
        dialog.addEventListener("change", () => {
          const atlaspack = this.atlaspack_;
          const num_files = dialog.files.length;
          for(let i = 0; i < num_files; ++i) {
            const read_file = dialog.files[i];
            if(!read_file.name.match(/.png/i)) {
              continue;
            }

            const image = new Image();
            image.name = read_file.name;
            image.onload = ()=> {
              const node = atlaspack.pack(image);
              if(!node) {
                console.log("Packing failed : " + image.name);
              }
            };
            image.src = URL.createObjectURL(read_file);
          }
        });
        dialog.click();
      }).addButton("SAVE", () => {
        const element_save = document.createElement("a");
        element_save.href = this.atlaspack_.canvas.toDataURL();
        element_save.download = atlaspack_obj.name;
        element_save.click();
      }).addButton("APPLY", () => {
        const resolution = this.atlaspack_.canvas.width;
        const uv_map = this.atlaspack_.uv(resolution, resolution);
        // to do
      });


    const control_obj = {
      camera_speed: camera_pos_system.speed,
      capsule_scale_x: player_entity.getComponent("Scale").scale[0],
      capsule_scale_y: player_entity.getComponent("Scale").scale[1],
    };
    controlKit.addPanel({
      fixed: false,
      label: "Control",
      position: [0, 0],
    })
      .addSubGroup({
        label: "Camera"
      }).addButton("RESET", () => {
        glMatrix.vec3.set(player_entity.getComponent("Viewport").pos, 0, 0, 0);
      }).addNumberInput(control_obj, "camera_speed", {
        onChange: number => {
          camera_pos_system.speed = number;
        },
      })
      .addSubGroup({
        label: "Capsule"
      }).addNumberInput(control_obj, "capsule_scale_x", {
        onChange: number => {
          player_entity.getComponent("Scale").scale[0] = number;
        },
      }).addNumberInput(control_obj, "capsule_scale_y", {
        onChange: number => {
          player_entity.getComponent("Scale").scale[1] = number;
        },
      });

    return this;
  }

  Update() {
    super.Update();

    this.controlKit_.update();
  }
}
