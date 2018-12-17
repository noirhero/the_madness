// Copyright 2018 TAP, Inc. All Rights Reserved.

class EditorTiledScene extends Scene {
  constructor() {
    super();

    const entity = new CES.Entity();
    entity.addComponent(new ComponentViewport());

    const world = this.world_;
    world.addSystem(new SystemViewport);
    world.addSystem(new SystemRenderSprite);
    world.addEntity(entity);

    this.entity_ = entity;
    this.controlKit_ = new ControlKit();
  }

  Initialize() {
    const controlKit = this.controlKit_;
    const world = this.world_;

    controlKit.addPanel({
      fixed: false,
      label: "Tiled",
      position: [0, 0],
    }).addButton("LOAD", () => {
      const element_load = document.createElement("load");
      element_load.innerHTML = "<input type=\"file\" accept=\".json\">";

      const dialog = element_load.firstChild;
      dialog.addEventListener("change", () => {
        const file = dialog.files[0];
        if (file.name.match(/.json/i)) {
          world.name = file.name;

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
    });

    return this;
  }

  Update() {
    super.Update();

    this.controlKit_.update();
  }
}
