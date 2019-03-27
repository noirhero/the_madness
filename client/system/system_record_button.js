// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemRecordButton = CES.System.extend({
  init: function() {
    this.w = 0;
    this.h = 0;
    this.camera_pos = glMatrix.vec3.create();
  },
  update: function() {
    const world = this.world;

    let record_btn_entity = null;
    if(false === world.getEntities("RecordButton", "Pos", "Scale", "Texture", "Bounding").some(entity => {
      record_btn_entity = entity;
      return true;
    })) {
      return;
    }

    const record_btn_comp = record_btn_entity.getComponent("RecordButton");

    const update_record_button_pos_fn = () => {
      const pos = record_btn_entity.getComponent("Pos").pos;
      const scale = record_btn_entity.getComponent("Scale").scale;

      scale[0] = scale[1] = Math.min(record_btn_comp.max_scale, Math.max(CANVAS_W * record_btn_comp.width_ratio, CANVAS_H * record_btn_comp.height_ratio));
      pos[0] = this.camera_pos[0] + (CANVAS_W * 0.5) - (record_btn_comp.right_offset * scale[0]) - (scale[0] * 0.5);
      pos[1] = this.camera_pos[1] + (CANVAS_H * -0.5) + (record_btn_comp.right_offset * scale[1]) + (scale[1] * 0.5);

      const record_btn_bounding_comp = record_btn_entity.getComponent("Bounding");
      if(!record_btn_bounding_comp.data) {
        const pos = record_btn_entity.getComponent("Pos").pos;
        const scale = record_btn_entity.getComponent("Scale").scale;

        record_btn_bounding_comp.data = new SAT.Box(new SAT.V(pos[0] - scale[0] * 0.5, pos[1] - scale[1] * 0.5), scale[0], scale[1]).toPolygon();
      }
      else {
        record_btn_bounding_comp.data.pos.x = pos[0];
        record_btn_bounding_comp.data.pos.y = pos[1];
      }
    };
    const check_to_resolution_fn = () => {
      if(CANVAS_W !== this.w || CANVAS_H !== this.h) {
        record_btn_entity.getComponent("Bounding").data = null;

        this.w = CANVAS_W;
        this.h = CANVAS_H;
        update_record_button_pos_fn();
      }
    };

    if(false === world.getEntities("Viewport").some(entity => {
      const camera_pos = entity.getComponent("Viewport").pos;
      if(1 < Math.abs(camera_pos[0] - this.camera_pos[0]) || 1 < Math.abs(camera_pos[1] - this.camera_pos[1])) {
        glMatrix.vec3.copy(this.camera_pos, camera_pos);
        update_record_button_pos_fn();
      }
      else {
        check_to_resolution_fn();
      }
    })) {
      check_to_resolution_fn();
    }

    let is_recording = false;
    this.world.getEntities("Mic").some(entity => {
      is_recording = entity.getComponent("Mic").is_recording;
      return true;
    });

    const texture_comp = record_btn_entity.getComponent("Texture");
    if(true === is_recording && texture_comp.texture !== record_btn_comp.press_texture) {
      texture_comp.texture = record_btn_comp.press_texture;
    }
    else if(false === is_recording && texture_comp.texture !== record_btn_comp.normal_texture){
      texture_comp.texture = record_btn_comp.normal_texture;
    }
  },
});
