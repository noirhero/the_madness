// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentRecordButton = CES.Component.extend({
  name: "RecordButton",
  init: function() {
    this.normal_texture = new Texture("data/texture/talk_0.png");
    this.press_texture = new Texture("data/texture/talk_1.png");
    this.width_ratio = 0.1;
    this.height_ratio = 0.1;
    this.right_offset = 0.5;
    this.bottom_offset = 0.5;
  },
});
