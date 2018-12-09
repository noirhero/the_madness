// Copyright 2018 TAP, Inc. All Rights Reserved.

var TEXTURES = {};

function Texture(url) {
  "use strict";

  let texture = GL.createTexture();
  let image = new Image();
  image.onload = function() {
    console.log("On Load : " + url);

    GL.activeTexture(GL.TEXTURE0);
    GL.bindTexture(GL.TEXTURE_2D, texture);
    GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
    GL.bindTexture(GL.TEXTURE_2D, null);

    image = null;
  };
  image.src = url;

  this.GetTexture = function() {
    return texture;
  };

  this.IsRenderable = function() {
    return (null !== image) ? false : true;
  };
}
