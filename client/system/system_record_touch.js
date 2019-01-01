// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemRecordTouch = CES.System.extend({
  init: function() {
    this.is_press = false;
    this.press_circle = new SAT.Circle(new SAT.V(), 20);
    this.is_exporting = false;
    this.stop_timer = null;

    document.addEventListener("touchstart", event => {
      const touch = event.changedTouches[0];

      this.is_press = true;
      this.press_circle.pos.x = touch.clientX - CANVAS_W * 0.5;

      const half_h = CANVAS_H * 0.5;
      if(half_h > touch.clientY) {
        this.press_circle.pos.y = half_h - touch.clientY;
      }
      else if(half_h < touch.clientY) {
        this.press_circle.pos.y = (touch.clientY - half_h) * -1;
      }
      else {
        this.press_circle.pos.y = 0;
      }
    }, false);

    document.addEventListener("touchend", event => {
      this.is_press = false;
    }, false);
  },
  update: function() {
    const websocket_entities = this.world.getEntities("Websocket");
    if(0 === websocket_entities.length) {
      return;
    }

    const websocket_comp = websocket_entities[0].getComponent("Websocket");
    if(!websocket_comp.socket || 1/*open*/ !== websocket_comp.socket.readyState) {
      return;
    }

    const record_btn_entites = this.world.getEntities("RecordButton", "Pos", "Scale", "Bounding");
    if(0 === record_btn_entites.length) {
      return;
    }

    const record_btn_entity = record_btn_entites[0];
    const record_btn_bounding_comp = record_btn_entity.getComponent("Bounding");
    if(!record_btn_bounding_comp.data) {
      const pos = record_btn_entity.getComponent("Pos").pos;
      const scale = record_btn_entity.getComponent("Scale").scale;
      record_btn_bounding_comp.data = new SAT.Box(new SAT.V(pos[0] - scale[0] * 0.5, pos[1] - scale[1] * 0.5), scale[0], scale[1]).toPolygon();
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

        mic_comp.recorder.clear();
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
      }, 2000);
    }

    if(true === this.is_exporting) {
      return;
    }

    this.world.getEntities("Mic").forEach(entity => {
      const mic_comp = entity.getComponent("Mic");
      if(!mic_comp.recorder) {
        return;
      }

      if(true === this.is_press) {
        if(true === SAT.testPolygonCircle(record_btn_bounding_comp.data, this.press_circle)) {
          StartRecord.call(this, mic_comp);
        }
      }
      else {
        StopRecord.call(this, mic_comp);
      }
    });
  },
});
