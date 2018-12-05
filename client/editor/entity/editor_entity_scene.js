// Copyright 2018 TAP, Inc. All Rights Reserved.

class EditorEntityScene extends Scene {
  constructor() {
    super();

    this.entity_ = new CES.Entity();
    this.world_.addEntity(this.entity_);
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
        anim_state: "none",
        anim_duration: 0,
        anim_url: "none",
      },
      pos: {
        x: 0,
        y: 0,
        z: 0,
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
        }).addStringInput(edit_anim_data, "anim_state", {label: "State"})
          .addNumberInput(edit_anim_data, "anim_duration", {label: "Duration"})
          .addStringInput(edit_anim_data, "anim_url", {label: "URL"})
          .addButton("Reload", function() {
            entity.removeComponent("Anim");
            //entity.addComponent(new ComponentAnim(edit_anim_data.anim_url.replace(/[../]/g, "")));
            entity.addComponent(new ComponentAnim(edit_anim_data.anim_url));
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
          .addNumberInput(edit_pos_data, "z", {label: "Z"});
      }
    }).addSubGroup({
      label: "Management"
    }).addStringInput(edit_data, "name").addButton("SAVE", function() {
      const save_data = {};

      if(entity.getComponent("Anim")) {
        save_data.anim_comp = edit_data.anim;
      }
      if(entity.getComponent("Pos")) {
        save_data.pos_comp = edit_data.pos;
      }

      const blob = new Blob([JSON.stringify(save_data, null, " ")], {type: "application/json"});

      const element_save = document.createElement("a");
      element_save.href = URL.createObjectURL(blob);
      element_save.download = edit_data.name;
      element_save.click();
    }).addButton("RESET", function() {
      entity.removeComponent("Anim");
      entity.removeComponent("Pos");

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
