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
    let controlKit = this.controlKit_;

    controlKit.addPanel({
      fixed: false,
      label: "Tiled",
      position: [0, 0],
    }).addButton("LOAD", () => {
      console.log("LOAD");
    });

    return this;
  }

  Update() {
    super.Update();

    this.controlKit_.update();
  }
}
