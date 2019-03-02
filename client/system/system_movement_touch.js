// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemMovementTouch = CES.System.extend({
  init: function() {
    this.press_left = false;
    this.press_right = false;
    this.left_id = -1;
    this.right_id = -1;
    this.direction = glMatrix.vec3.create();

    document.addEventListener("touchstart", event => {
      const half_w = CANVAS_W * 0.5;

      const num_touches = event.changedTouches.length;
      for(let i = 0; i < num_touches; ++i) {
        const touch = event.changedTouches[i];

        if(half_w > touch.clientX) {
          this.press_left = true;
          this.left_id = touch.identifier;
        }
        else {
          this.press_right = true;
          this.right_id = touch.identifier;
        }
      }
    }, false);

    document.addEventListener("touchend", event => {
      const num_touches = event.changedTouches.length;
      for(let i = 0; i < num_touches; ++i) {
        const touch = event.changedTouches[i];

        if(this.left_id === touch.identifier) {
          this.press_left = false;
          this.left_id = -1;
        }
        else if(this.right_id === touch.identifier){
          this.press_right = false;
          this.right_id = -1;
        }
      }
    }, false);
  },
  update: function(delta) {
    const mic_entites = this.world.getEntities("Mic");
    if(0 < mic_entites.length) {
      if(true === mic_entites[0].getComponent("Mic").is_recording) {
        return;
      }
    }

    const direction = this.direction;
    direction[0] = 0;
    if(true === this.press_left) {
      direction[0] -= 1;
    }
    if(true === this.press_right) {
      direction[0] += 1;
    }

    this.world.getEntities("Player", "Pos").forEach(entity => {
      const speed = entity.getComponent("Player").move_speed;
      const pos = entity.getComponent("Pos").pos;
      glMatrix.vec3.scaleAndAdd(pos, pos, direction, delta * speed);
    });
  },
})
