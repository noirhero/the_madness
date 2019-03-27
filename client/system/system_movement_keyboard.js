// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemMovementKeyboard = CES.System.extend({
  init: function() {
    this.press_left = false;
    this.press_right = false;
    this.direction = glMatrix.vec3.create();

    document.addEventListener("keydown", event => {
      if(false === event.repeat) {
        if("ArrowLeft" === event.code) {
          this.press_left = true;
          event.preventDefault();
        }
        if("ArrowRight" === event.code) {
          this.press_right = true;
          event.preventDefault();
        }
      }
    }, false);

    document.addEventListener("keyup", event => {
      if(false === event.repeat) {
        if("ArrowLeft" === event.code) {
          this.press_left = false;
          event.preventDefault();
        }
        if("ArrowRight" === event.code) {
          this.press_right = false;
          event.preventDefault();
        }
      }
    }, false);
  },
  update: function(delta) {
    const world = this.world;

    if(true === world.getEntities("Mic").some(entity => {
      return entity.getComponent("Mic").is_recording;
    })) {
      return;
    }

    const direction = this.direction;
    direction[0] = 0;
    if(true === this.press_left) {
      direction[0] -= 1;
    }
    if(true === this.press_right) {
      direction[0] += 1;
    }

    world.getEntities("Player", "Pos").forEach(entity => {
      const speed = entity.getComponent("Player").move_speed;
      const pos = entity.getComponent("Pos").pos;
      glMatrix.vec3.scaleAndAdd(pos, pos, direction, delta * speed);
    });
  },
});
