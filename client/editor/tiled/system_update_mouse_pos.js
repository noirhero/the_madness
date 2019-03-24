// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemUpdateMousePos = CES.System.extend({
  init: function() {
    this.x = 0;
    this.y = 0;

    CANVAS.addEventListener("mousemove", event => {
      this.x = event.x - CANVAS_W * 0.5;
      this.y = CANVAS_H - event.y - CANVAS_H * 0.5;
    }, false);
  },
  update: function() {
    const world = this.world;

    let camera_pos = null;
    if(false === world.getEntities("Viewport").some(entity => {
      camera_pos = entity.getComponent("Viewport").pos;
      return true;
    })) {
      return;
    }

    this.world.getEntities("Player", "Pos").forEach(entity => {
      const pos = entity.getComponent("Pos").pos;
      pos[0] = this.x + camera_pos[0];
      pos[1] = this.y + camera_pos[1];
    });
  },
});
