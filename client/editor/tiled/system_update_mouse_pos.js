// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemUpdateMousePos = CES.System.extend({
  init: function() {
    this.x = 0;
    this.y = 0;

    CANVAS.addEventListener("mousemove", event => {
      this.x = event.x - CANVAS_W * 0.5;
      this.y = event.y - CANVAS_H * 0.5;
    }, false);
  },
  update: function() {
    const viewport_in_entities = this.world.getEntities("Viewport");
    if(0 === viewport_in_entities.length) {
      return;
    }

    const camera_pos = viewport_in_entities[0].getComponent("Viewport").pos;

    this.world.getEntities("Player", "Pos").forEach(entity => {
      const pos = entity.getComponent("Pos").pos;
      pos[0] = this.x + camera_pos[0] * CANVAS_W * -0.5;
      pos[1] = -this.y + camera_pos[1] * CANVAS_H * -0.5;
    });
  },
});
