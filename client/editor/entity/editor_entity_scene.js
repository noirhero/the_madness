// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

class EditorEntityScene extends Scene {
  constructor() {
    super();

    const entity = new CES.Entity();
    entity.addComponent(new ComponentViewport());

    const world = this.world_;
    world.addSystem(new SystemViewport);
    world.addSystem(new SystemAnimation);
    world.addSystem(new SystemRenderSprite);
    world.addEntity(entity);

    this.entity_ = entity;
    this.controlKit_ = new ControlKit();
  }

  Initialize() {
    let entity = this.entity_;
    let controlKit = this.controlKit_;

    let entity_panel = controlKit.addPanel({
      fixed: false,
      label: "Entity",
      position: [0, 0],
    });

    let edit_data = {
      name: "none",
      anim: {
        state: "none",
        duration: 0,
        url: "none",
      },
      pos: {
        x: 0,
        y: 0,
        z: 0,
      },
      rot: {
        x: 0,
        y: 0,
        z: 0,
      },
      scale: {
        x: 1,
        y: 1,
        z: 1,
      },
      texture: {
        url: "",
      },
    };

    controlKit.addPanel({
      fixed: false,
      label: "Main",}).addSubGroup({
      label: "Components",
    }).addButton("Animation", function() {
      const edit_anim_data = edit_data.anim;

      if(!entity.getComponent("Anim")) {
        entity.addComponent(new ComponentAnim());
        entity_panel.addGroup({
          label: "Animation",
        }).addStringInput(edit_anim_data, "state", {label: "State"})
          .addNumberInput(edit_anim_data, "duration", {label: "Duration"})
          .addStringInput(edit_anim_data, "url", {label: "URL"})
          .addButton("Reload", function() {
            entity.removeComponent("Anim");
            entity.addComponent(new ComponentAnim(edit_anim_data.url));
            entity.getComponent("Anim").state = edit_anim_data.state;
            entity.getComponent("Anim").duration = edit_anim_data.duration;
          });
      }
    }).addButton("Position", function() {
      const edit_pos_data = edit_data.pos;

      if(!entity.getComponent("Pos")) {
        entity.addComponent(new ComponentPos());
        entity_panel.addGroup({
          label: "Position",
        }).addNumberInput(edit_pos_data, "x", {label: "X"})
          .addNumberInput(edit_pos_data, "y", {label: "Y"})
          .addNumberInput(edit_pos_data, "z", {label: "Z"})
          .addButton("Reload", function() {
            entity.getComponent("Pos").pos = glMatrix.vec3.fromValues(edit_pos_data.x, edit_pos_data.y, edit_pos_data.z);
          });
      }
    }).addButton("Rotation", function() {
      const edit_rot_data = edit_data.rot;

      if(!entity.getComponent("Rot")) {
        entity.addComponent(new ComponentRot());
        entity_panel.addGroup({
          label: "Rotation",
        }).addNumberInput(edit_rot_data, "x", {label: "X Degree"})
          .addNumberInput(edit_rot_data, "y", {label: "Y Degree"})
          .addNumberInput(edit_rot_data, "z", {label: "Z Degree"})
          .addButton("Reload", function() {
            glMatrix.quat.fromEuler(entity.getComponent("Rot").rot, edit_rot_data.x, edit_rot_data.y, edit_rot_data.z);
          });
      }
    }).addButton("Scale", function() {
      const edit_scale_data = edit_data.scale;

      if(!entity.getComponent("Scale")) {
        entity.addComponent(new ComponentScale());
        entity_panel.addGroup({
          label: "Scale",
        }).addNumberInput(edit_scale_data, "x", {label: "X"})
          .addNumberInput(edit_scale_data, "y", {label: "Y"})
          .addNumberInput(edit_scale_data, "z", {label: "Z"})
          .addButton("Reload", function() {
            entity.getComponent("Scale").scale = glMatrix.vec3.fromValues(edit_scale_data.x, edit_scale_data.y, edit_scale_data.z);
          });
      }
    }).addButton("Texcoord", function() {
      if(!entity.getComponent("Texcoord")) {
        entity.addComponent(new ComponentTexcoord());
        entity_panel.addGroup({
          label: "Texcoord",
        });
      }
    }).addButton("Texture", function() {
      const edit_texture_data = edit_data.texture;

      if(!entity.getComponent("Texture")) {
        entity.addComponent(new ComponentTexture());
        entity_panel.addGroup({
          label: "Texture",
        }).addStringInput(edit_texture_data, "url", {label: "URL"})
          .addButton("Reload", function() {
            entity.removeComponent("Texture");
            entity.addComponent(new ComponentTexture(edit_texture_data.url));
          });
      }
    }).addSubGroup({
      label: "Management"
    }).addStringInput(edit_data, "name").addButton("SAVE", function() {
      const save_data = {};

      if(entity.getComponent("Anim")) {
        save_data.anim_comp = edit_data.anim;
        save_data.anim_comp.url = save_data.anim_comp.url.slice(save_data.anim_comp.url.indexOf("data"));
      }
      if(entity.getComponent("Pos")) {
        save_data.pos_comp = edit_data.pos;
      }
      if(entity.getComponent("Rot")) {
        save_data.rot_comp = edit_data.rot;
      }
      if(entity.getComponent("Scale")) {
        save_data.scale_comp = edit_data.scale;
      }
      if(entity.getComponent("Texcoord")) {
        save_data.texcoord_comp = {};
      }
      if(entity.getComponent("Texture")) {
        save_data.texture_comp = edit_data.texture;
        save_data.texture_comp.url = save_data.texture_comp.url.slice(save_data.texture_comp.url.indexOf("data"));
      }

      const blob = new Blob([JSON.stringify(save_data, null, " ")], {type: "application/json"});

      const element_save = document.createElement("a");
      element_save.href = URL.createObjectURL(blob);
      element_save.download = edit_data.name;
      element_save.click();
    }).addButton("RESET", function() {
      entity.removeComponent("Anim");
      entity.removeComponent("Pos");
      entity.removeComponent("Rot");
      entity.removeComponent("Scale");
      entity.removeComponent("Texcoord");
      entity.removeComponent("Texture");

      entity_panel.disable();
      entity_panel = controlKit.addPanel({
        fixed: false,
        label: "Entity",
        position: [0, 0],
      });
    });

    return this;
  }

  Update() {
    super.Update();

    this.controlKit_.update();
  }
}
