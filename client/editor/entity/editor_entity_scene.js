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
      anim_state: "none",
      anim_duration: 0,
      anim_url: "none",
    };

    controlKit.addPanel({
      fixed: false,
      label: "Main",
    }).addSubGroup({
      label: "Components",
    }).addButton("Animation", function() {
      if(!entity.getComponent("Anim")) {
        entity.addComponent(new ComponentAnim());
        entity_panel.addGroup({
          label: "Animation",
        }).addStringInput(edit_data, "anim_state", {label: "State"})
          .addNumberInput(edit_data, "anim_duration", {label: "Duration"})
          .addStringInput(edit_data, "anim_url", {label: "URL"})
          .addButton("Reload", function() {
            entity.removeComponent("Anim");
            entity.addComponent(new ComponentAnim(edit_data.anim_url.replace(/[../]/g, "")));
          });
      }
    }).addSubGroup({
      label: "Management"
    }).addButton("SAVE", function() {

    });

    return this;
  }

  Update() {
    super.Update();

    this.controlKit_.update();
  }
}
