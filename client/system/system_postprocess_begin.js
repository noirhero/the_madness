// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemPostprocessBegin = CES.System.extend({
  init: function() {
    WebGLCreateSceneTexture();
    WebGLCreateSceneFrameBuffer();
    WebGLCreateSceneDepthBuffer();

    this.w = CANVAS_W;
    this.h = CANVAS_H;
  },
  update: function() {
    if(this.w !== CANVAS_W || this.h !== CANVAS_H) {
      WebGLResizeSceneResources();
      this.w = CANVAS_W;
      this.h = CANVAS_H;
    }

    GL.bindFramebuffer(GL.FRAMEBUFFER, SCENE_FRAME_BUFFER);
  },
});
