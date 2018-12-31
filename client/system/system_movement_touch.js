// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemMovementTouch = CES.System.extend({
  init: function() {
    this.press_left = false;
    this.press_right = false;

    document.addEventListener("touchstart", event => {
      console.log(event);
    });
  },
  update: function() {

  },
})
