// Copyright 2018, TAP, Inc. All Rights Reserved.

var CANVAS = null;
var CANVAS_W = 0;
var CANVAS_H = 0;
var GL = null;

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

  if(CANVAS_W !== CANVAS.width) {
    CANVAS.width = CANVAS_W;
  }

  if(CANVAS_H !== CANVAS.height) {
    CANVAS.height = CANVAS_H;
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
