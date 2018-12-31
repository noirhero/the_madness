// Copyright 2018 TAP, Inc. All Rights Reserved.

var SCENE_TEXTURE = null;
var SCENE_FRAME_BUFFER = null;
var SCENE_DEPTH_BUFFER = null;

function WebGLCreateSceneTexture() {
  SCENE_TEXTURE = GL.createTexture();

  GL.activeTexture(GL.TEXTURE0);
  GL.bindTexture(GL.TEXTURE_2D, SCENE_TEXTURE);
  GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, CANVAS_W, CANVAS_H, 0, GL.RGBA, GL.UNSIGNED_BYTE, null);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
}

function WebGLCreateSceneFrameBuffer() {
  SCENE_FRAME_BUFFER = GL.createFramebuffer();

  GL.bindFramebuffer(GL.FRAMEBUFFER, SCENE_FRAME_BUFFER);
  GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, SCENE_TEXTURE, 0);
  GL.bindFramebuffer(GL.FRAMEBUFFER, null);
}

function WebGLCreateSceneDepthBuffer() {
  //GL.bindFramebuffer(GL.FRAMEBUFFER, SCENE_FRAME_BUFFER);

  SCENE_DEPTH_BUFFER = GL.createRenderbuffer();
  GL.bindRenderbuffer(GL.RENDERBUFFER, SCENE_DEPTH_BUFFER);
  GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, CANVAS_W, CANVAS_H);
  GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, SCENE_DEPTH_BUFFER);
  GL.bindRenderbuffer(GL.RENDERBUFFER, null);

  //GL.bindFramebuffer(GL.FRAMEBUFFER, null);
}

function WebGLResizeSceneResources() {
  WebGLCreateSceneTexture();

  GL.bindFramebuffer(GL.FRAMEBUFFER, SCENE_FRAME_BUFFER);
  GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, SCENE_TEXTURE, 0);

  WebGLCreateSceneDepthBuffer();
}
