// Copyright 2018 TAP, Inc. All Rights Reserved.

const LIMIT_TEXTURE = 8; // iPhone 5s, Galaxy note 3.

const IDENTITY_QUAT = quat.create();

const EMPTY_TEXCOORD = [
  vec2.fromValues(0.0, 1.0),
  vec2.fromValues(1.0, 1.0),
  vec2.fromValues(0.0, 0.0),
  vec2.fromValues(1.0, 0.0),
];

const QUAD_LOCAL_POS = [
  vec3.fromValues(-0.5, 0.5, 0.0),
  vec3.fromValues(0.5, 0.5, 0.0),
  vec3.fromValues(-0.5, -0.5, 0.0),
  vec3.fromValues(0.5, -0.5, 0.0),
];

const NUM_BATCH = 130;
const BATCH_QUAD_XYZUV = new Float32Array(NUM_BATCH * 5/*xyz uv*/ * 4/*quad*/);
const BATCH_QUAD_XYZIUV = new Float32Array(NUM_BATCH * 6/*xyz uv ti*/ * 4/*quad*/);
const BATCH_QUAD_I = function() {
  const indices = new Uint16Array(NUM_BATCH * 6/*two polygon*/);

  let offset = 0;
  let offset_idx = 0;
  for(let i = 0; i < NUM_BATCH; ++i) {
    indices[offset++] = offset_idx;
    indices[offset++] = offset_idx + 1;
    indices[offset++] = offset_idx + 2;
    indices[offset++] = offset_idx + 2;
    indices[offset++] = offset_idx + 3;
    indices[offset++] = offset_idx + 1;

    offset_idx += 4/*quad*/;
  }
  return indices;
}();
