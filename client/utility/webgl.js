// Copyright 2018, TAP, Inc. All Rights Reserved.

var CANVAS = null;
var CANVAS_W = 0;
var CANVAS_H = 0;
var GL = null;
var FRAME_DATAS = [];

function WebGLInitialize() {
  function IgnoreEvent(event) {
    event.preventDefault();
  }

  const main = document.getElementById("main");
  main.ontouchmove = IgnoreEvent;

  CANVAS = document.getElementById("main_canvas");
  CANVAS.ontouchmove = IgnoreEvent;

  const options = {
    premultipliedAlpha: false,
    antialias: false,
  };
  GL = CANVAS.getContext("webgl", options);
  if(!GL) {
    GL = CANVAS.getContext("experiment-webgl", options);
  }
}

function WebGLUpdate() {
  CANVAS_W = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  CANVAS_H = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  if(CANVAS_W !== CANVAS.width || CANVAS_H !== CANVAS.height) {
    CANVAS.width = CANVAS_W;
    CANVAS.height = CANVAS_H;

    for(let i in FRAME_DATAS) {
      const frame_data = FRAME_DATAS[i];

      const texture = GL.createTexture();
      GL.activeTexture(GL.TEXTURE0);
      GL.bindTexture(GL.TEXTURE_2D, texture);
      GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, CANVAS_W, CANVAS_H, 0, GL.RGBA, GL.UNSIGNED_BYTE, null);
      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

      GL.bindFramebuffer(GL.FRAMEBUFFER, frame_data.frame_buffer);
      GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, texture, 0);

      const depth_buffer = GL.createRenderbuffer();
      GL.bindRenderbuffer(GL.RENDERBUFFER, depth_buffer);
      GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, CANVAS_W, CANVAS_H);
      GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, depth_buffer);
      GL.bindRenderbuffer(GL.RENDERBUFFER, null);

      GL.bindFramebuffer(GL.FRAMEBUFFER, null);

      frame_data.texture = texture;
      frame_data.depth_buffer = depth_buffer;
    }
  }
}

function WebGLCreateShader(src, type) {
  let shader = GL.createShader(type);
  GL.shaderSource(shader, src);
  GL.compileShader(shader);

  if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
    alert("Compile shader failed.\n" + src + "\n" + GL.getShaderInfoLog(shader));
    shader = null;
  }

  return shader;
}

function WebGLCreateProgram(vs, fs) {
  let program = GL.createProgram();
  GL.attachShader(program, vs);
  GL.attachShader(program, fs);
  GL.linkProgram(program);

  if (!GL.getProgramParameter(program, GL.LINK_STATUS)) {
    alert("Prgram link failed.");
    program = null;
  }

  return program;
}

function WebGLCreateBuffer(target, src, usage) {
  let buffer = GL.createBuffer();
  GL.bindBuffer(target, buffer);
  GL.bufferData(target, src, usage);

  return buffer;
}

function WebGLCreateFrameData(index) {
  "use strict";

  const frame_data = (() => {
    const texture = GL.createTexture();
    GL.activeTexture(GL.TEXTURE0);
    GL.bindTexture(GL.TEXTURE_2D, texture);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, CANVAS_W, CANVAS_H, 0, GL.RGBA, GL.UNSIGNED_BYTE, null);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

    const frame_buffer = GL.createFramebuffer();
    GL.bindFramebuffer(GL.FRAMEBUFFER, frame_buffer);
    GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, texture, 0);

    const depth_buffer = GL.createRenderbuffer();
    GL.bindRenderbuffer(GL.RENDERBUFFER, depth_buffer);
    GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, CANVAS_W, CANVAS_H);
    GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, depth_buffer);
    GL.bindRenderbuffer(GL.RENDERBUFFER, null);

    GL.bindFramebuffer(GL.FRAMEBUFFER, null);

    return {
      texture: texture,
      frame_buffer: frame_buffer,
      depth_buffer: depth_buffer
    };
  })();

  FRAME_DATAS[index] = frame_data;
  return frame_data;
}
