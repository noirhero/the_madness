// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentRecordButton = CES.Component.extend({
  name: "RecordButton",
  init: function() {
    const normal_texture_url = "data/texture/talk_0.png";
    const press_texture_url = "data/texture/talk_1.png";
    this.normal_texture = TEXTURES[normal_texture_url];
    this.press_texture = TEXTURES[press_texture_url];

    if(!this.normal_texture) {
      TEXTURES[normal_texture_url] = this.normal_texture = new Texture(normal_texture_url);
    }
    if(!this.press_texture) {
      TEXTURES[press_texture_url] = this.press_texture = new Texture(press_texture_url);
    }

    this.width_ratio = 0.1;
    this.height_ratio = 0.1;
    this.right_offset = 0.5;
    this.bottom_offset = 0.5;
  },
});
