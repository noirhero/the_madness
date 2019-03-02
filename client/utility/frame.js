// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

var FRAME_ID = 0;
var FRAME_FN = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var CANCEL_FRAME_FN = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

function Frame(fn) {
  FRAME_ID = FRAME_FN(fn);
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
