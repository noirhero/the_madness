// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemRecordKeyboard = CES.System.extend({
  update: function() {
    this.world.getEntities("Mic").forEach(entity => {
      const mic_comp = entity.getComponent("Mic");
      if(true === mic_comp.is_recording) {
        return;
      }
    });
  },
});
