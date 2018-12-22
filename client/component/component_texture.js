// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentTexture = CES.Component.extend({
  name: "Texture",
  init: function(url) {
    let texture = TEXTURES[url];
    if(!texture) {
      TEXTURES[url] = texture = new Texture(url);
    }

    this.url = url;
    this.texture = texture;
  },
});
