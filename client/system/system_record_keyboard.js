// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemRecordKeyboard = CES.System.extend({
  init: function() {
    this.is_exporting = false;
    this.is_press = false;
    this.stop_timer = null;

    document.addEventListener("keydown", event => {
      if("Space" == event.code) {
        if(false === event.repeat) {
          this.is_press = true;
        }
        event.preventDefault();
      }
    }, false);

    document.addEventListener("keyup", event => {
      if("Space" == event.code) {
        this.is_press = false;
        event.preventDefault();
      }
    });
  },
  update: function() {
    const websocket_entities = this.world.getEntities("Websocket");
    if(0 === websocket_entities.length) {
      return;
    }

    const websocket_comp = websocket_entities[0].getComponent("Websocket");
    if(!websocket_comp.socket) {
      return;
    }

    function StopRecord(mic_comp) {
      if(false === mic_comp.is_recording) {
        return;
      }

      console.log("Stop record");

      if(this.stop_timer) {
        clearTimeout(this.stop_timer);
        this.stop_timer = null;
        this.is_press = false;
      }

      mic_comp.recorder.stop();
      mic_comp.recorder.exportWAV(blob => {
        websocket_comp.socket.send(blob);

        mic_comp.is_recording = false;
        this.is_exporting = false;
      });

      this.is_exporting = true;
    }

    function StartRecord(mic_comp) {
      if(true === mic_comp.is_recording) {
        return;
      }

      console.log("Start record");

      mic_comp.is_recording = true;
      mic_comp.recorder.record();

      this.stop_timer = setTimeout(() => {
        StopRecord.call(this, mic_comp);
      }, 1000);
    }

    if(true === this.is_exporting) {
      return;
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
