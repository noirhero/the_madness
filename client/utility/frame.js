// Copyright 2018 TAP, Inc. All Rights Reserved.

function GetFrameFunction() {
  return window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
}

function GetCancelFrameFunction() {
  return window.cancelAnimationFrame || window.mozCancelAnimationFrame;
}

var FRAME_ID = 0;
function Frame(fn) {
  FRAME_ID = GetFrameFunction()(fn);
}

class FramePerSecond {
  constructor() {
    this.second_ = 0;
    this.frame_ = 0;
    this.fps_ = 0;
  }

  Update(delta) {
    ++this.frame_;
    this.second_ += delta;

    if(1 < this.second_) {
      this.fps_ = this.frame_;
      this.frame_ = 0;
      this.second_ -= 1;
    }

    return this;
  }

  get FPS() {
    return this.fps_;
  }
}
