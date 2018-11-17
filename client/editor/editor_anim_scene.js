// Copyright 2018 TAP, Inc. All Rights Reserved.

class EditorAnimScene extends Scene {
  constructor() {
    super();

    this.entity_ = new CES.Entity();
    this.world_.addEntity(this.entity_);

    this.controlKit_ = new ControlKit();
  }

  Initialize() {
    let entity = this.entity_;
    let contolKit = this.controlKit_;

    contolKit.addPanel({
      fixed: false,
      label: "Main",
    }).addButton("OPEN", function() {
      const element_load = document.createElement("load");
      element_load.innerHTML = "<input type=\"file\">";

      const dialog = element_load.firstChild;
      dialog.addEventListener("change", function() {
        const file = dialog.files[0];
        if (file.name.match(/.json/i)) {
          const reader = new FileReader();
          reader.onload = function() {
            entity.removeComponent("Anim");

            const anim_data = AnimationParse(reader.result);
            const anim_blob = new Blob([JSON.stringify(anim_data, null, " ")], { type: "application/json" });
            const anim_url = URL.createObjectURL(anim_blob);

            entity.addComponent(new ComponentAnim(anim_url));

            contolKit.addPanel({
              fixed: false,
              label: file.name,
            });

            // const save_data = {
            //   a: "a",
            //   b: "b",
            // };
            // const data = JSON.stringify(save_data, null, " ");
            // const blob = new Blob([data], {type: "application/json"});
            // const element_save = document.createElement("a");
            // element_save.href = URL.createObjectURL(blob);
            // element_save.download = "save.json";
            // element_save.click();
          };
          reader.readAsText(file);
        }
        else {
          alert("File not supported, .json files only");
        }
      });
      dialog.click();
    }, {
      label: "json File"
    });

    return this;
  }

  Update() {
    super.Update();

    this.controlKit_.update();
  }
}
