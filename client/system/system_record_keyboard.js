// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemRecordKeyboard = CES.System.extend({
  init: function() {
    this.is_press = false;

    document.addEventListener("keydown", event => {
      event.preventDefault();
      if("Space" == event.code) {
        this.is_press = true;
      }
    }, false);

    document.addEventListener("keyup", event => {
      event.preventDefault();
      if("Space" == event.code) {
        this.is_press = false;
      } _
    }, false);
  },
  update: function() {
    this.world.getEntities("Mic").forEach(entity => {
      const mic_comp = entity.getComponent("Mic");
      if(true === mic_comp.is_recording) {
        return;
      }
    });
  },
});
