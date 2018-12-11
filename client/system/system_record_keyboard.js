// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemRecordKeyboard = CES.System.extend({
  init: function() {
    this.is_press = false;
    this.stop_timer = null;

    document.addEventListener("keydown", event => {
      if("Space" == event.code) {
        this.is_press = true;
        event.preventDefault();
      }
    }, false);

    document.addEventListener("keyup", event => {
      if("Space" == event.code) {
        this.is_press = false;
        event.preventDefault();
      }
    }, false);
  },
  update: function() {
    function StopRecord(mic_comp) {
      if(false === mic_comp.is_recording) {
        return;
      }

      if(this.stop_timer) {
        console.log("StopTimer");
        clearTimeout(this.stop_timer);
        this.stop_timer = null;
      }

      mic_comp.recorder.stop();
      mic_comp.recorder.exportWAV(blob => {
        mic_comp.is_recording = false;
      });
    }

    function StartRecord(mic_comp) {
      if(true === mic_comp.is_recording) {
        return;
      }

      console.log("StartRecoder");

      mic_comp.is_recording = true;
      mic_comp.recorder.record();

      this.stop_timer = setTimeout(() => {
        StopRecord.call(this, mic_comp);
      }, 3000);
    }

    this.world.getEntities("Mic").forEach(entity => {
      const mic_comp = entity.getComponent("Mic");

      if(true === this.is_press) {
        StartRecord.call(this, mic_comp);
      }
      else {
        StopRecord.call(this, mic_comp);
      }
    });
  },
});
