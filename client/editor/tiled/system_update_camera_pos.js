// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemUpdateCameraPos = CES.System.extend({
  init: function() {
    this.is_wheel_press = false;
    this.move_x = 0;
    this.move_y = 0;

    CANVAS.addEventListener("mousedown", event => {
      if(1/*middle button*/ === event.button) {
        this.is_wheel_press = true;
      }
    });

    CANVAS.addEventListener("mouseup", event => {
      if(1/*middle button*/ === event.button) {
        this.is_wheel_press = false;
      }
    });

    CANVAS.addEventListener("mousemove", event => {
      if(false == this.is_wheel_press) {
        return;
      }

      this.move_x += event.movementX;
      this.move_y += event.movementY;
    }, false);
  },
  update: function(delta) {
    this.world.getEntities("Viewport").forEach(entity => {
      const pos = entity.getComponent("Viewport").pos;

      pos[0] += this.move_x * delta;
      pos[1] -= this.move_y * delta;
      this.move_x = 0;
      this.move_y = 0;
    });
  }
})
