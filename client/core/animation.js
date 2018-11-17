// Copyright 2018 TAP, Inc. All Rights Reserved.

var ANIMS = {};

function Animation(url) {
  "use strict";

  let data = null;

  function OnLoadAnimation(json_text) {
    data = JSON.parse(json_text);
  }
  ReadFile(url, OnLoadAnimation);

  this.GetTexCoord = function(state, duration, reverse_x) {
    function RecursiveFind(frames, duration, start, end) {
      const step = end - start;
      const offset = (0 === (step % 2)) ? 0 : 1;
      const pivot = start + Math.round(step / 2) - offset;

      const frame = frames[pivot];
      if(frame.start > duration) {
        return RecursiveFind(frames, duration, start, pivot);
      }
      else if(frame.end < duration) {
        return RecursiveFind(frames, duration, pivot, end);
      }

      return (true === reverse_x) ? frame.reverse_rect : frame.rect;
    }

    const frame_info = data[state];
    if(!frame_info) {
      return EMPTY_TEXCOORD;
    }

    if(frame_info.total_duration < duration) {
      duration %= frame_info.total_duration;
    }

    const frames = frame_info.frames;
    return RecursiveFind(frames, duration, 0, frames.length);
  };
}
