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
}
