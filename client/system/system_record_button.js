// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemRecordButton = CES.System.extend({
  init: function() {
    this.w = 0;
    this.h = 0;
  },
  update: function() {
    const record_btn_entities = this.world.getEntities("RecordButton", "Pos", "Scale", "Texture");
    if(0 === record_btn_entities.length) {
      return;
    }

    const record_btn_comp = record_btn_entities[0].getComponent("RecordButton");
    if(CANVAS_W !== this.w || CANVAS_H !== this.h) {
      record_btn_entities[0].getComponent("Bounding").data = null;
      const pos = record_btn_entities[0].getComponent("Pos").pos;
      const scale = record_btn_entities[0].getComponent("Scale").scale;

      scale[0] = scale[1] = Math.max(CANVAS_W * record_btn_comp.width_ratio, CANVAS_H * record_btn_comp.height_ratio);
      pos[0] = (CANVAS_W * 0.5) - (record_btn_comp.right_offset * scale[0]) - (scale[0] * 0.5);
      pos[1] = (CANVAS_H * -0.5) + (record_btn_comp.right_offset * scale[1]) + (scale[1] * 0.5);

      this.w = CANVAS_W;
      this.h = CANVAS_H;
    }

    let is_recording = false;
    this.world.getEntities("Mic").some(entity => {
      is_recording = entity.getComponent("Mic").is_recording;
      return true;
    });

    const texture_comp = record_btn_entities[0].getComponent("Texture");
    if(true === is_recording && texture_comp.texture !== record_btn_comp.press_texture) {
      texture_comp.texture = record_btn_comp.press_texture;
    }
    else if(false === is_recording && texture_comp.texture !== record_btn_comp.normal_texture){
      texture_comp.texture = record_btn_comp.normal_texture;
    }
  },
});
