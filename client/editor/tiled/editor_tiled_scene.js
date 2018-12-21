// Copyright 2018 TAP, Inc. All Rights Reserved.

class EditorTiledScene extends Scene {
  constructor() {
    super();

    const entity = new CES.Entity();
    entity.addComponent(new ComponentPlayer());
    entity.addComponent(new ComponentViewport());
    entity.addComponent(new ComponentPos());
    entity.addComponent(new ComponentScale(32, 32))
    entity.addComponent(new ComponentTexture("../../data/texture/capsule.png"));
    entity.addComponent(new ComponentTexcoord());

    const world = this.world_;
    world.addSystem(new SystemViewport());
    world.addSystem(new SystemRenderSprite());
    world.addSystem(new SystemUpdateMousePos());
    world.addSystem(new SystemUpdateCameraPos());
    world.addEntity(entity);

    this.entity_ = entity;
    this.controlKit_ = new ControlKit();
  }

  Initialize() {
    const controlKit = this.controlKit_;
    const world = this.world_;
    const player_entity = this.entity_;

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
      // const blob = new Blob([JSON.stringify(save_data, null, " ")], {type: "application/json"});
      //
      // const element_save = document.createElement("a");
      // element_save.href = URL.createObjectURL(blob);
      // element_save.download = edit_data.name;
      // element_save.click();
    });

    return this;
  }

  Update() {
    super.Update();

    this.controlKit_.update();
  }
}
