// Copyright 2018 TAP, Inc. All Rights Reserved.

function AnimationParse(json_text) {
  "use strict";

  const data = JSON.parse(json_text);
  const width = data.meta.size.w;
  const height = data.meta.size.h;
  const frames = data.frames;

  const anim_data = {};
  for(const i in frames) {
    const state_name = i.slice(0, i.indexOf(" "));

    let frame_info = anim_data[state_name];
    if(!frame_info) {
      frame_info = anim_data[state_name]  = {
        total_duration: 0,
        frames: [],
      };
    }

    const src_frame = frames[i];
    const left = src_frame.frame.x / width;
    const top = 1.0 - src_frame.frame.y / height;
    const right = left + src_frame.frame.w / width;
    const bottom = top - src_frame.frame.h / height;

    frame_info.frames[frame_info.frames.length] = {
      start: frame_info.total_duration,
      end: frame_info.total_duration + src_frame.duration * 0.001,
      rect: [
        vec2.fromValues(left, top),
        vec2.fromValues(right, top),
        vec2.fromValues(left, bottom),
        vec2.fromValues(right, bottom),
      ],
      reverse_rect: [
        vec2.fromValues(right, top),
        vec2.fromValues(left, top),
        vec2.fromValues(right, bottom),
        vec2.fromValues(left, bottom),
      ],
    };
    frame_info.total_duration += src_frame.duration * 0.001;
  }

  return anim_data;
}
