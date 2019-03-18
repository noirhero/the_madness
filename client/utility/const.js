// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const LIMIT_TEXTURE = 8; // iPhone 5s, Galaxy note 3.
const RAD_180 = glMatrix.glMatrix.toRadian(180);

const IDENTITY_QUAT = glMatrix.quat.create();

const EMPTY_TEXCOORD = [
  glMatrix.vec2.fromValues(0.0, 1.0),
  glMatrix.vec2.fromValues(1.0, 1.0),
  glMatrix.vec2.fromValues(0.0, 0.0),
  glMatrix.vec2.fromValues(1.0, 0.0),
];

const QUAD_LOCAL_POS = [
  glMatrix.vec3.fromValues(-0.5, 0.5, 0.0),
  glMatrix.vec3.fromValues(0.5, 0.5, 0.0),
  glMatrix.vec3.fromValues(-0.5, -0.5, 0.0),
  glMatrix.vec3.fromValues(0.5, -0.5, 0.0),
];

const NUM_BATCH = 256;
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
    indices[offset++] = offset_idx + 1;
    indices[offset++] = offset_idx + 3;
    indices[offset++] = offset_idx + 2;

    offset_idx += 4/*quad*/;
  }
  return indices;
}();

const LINE_QUAD_XY = new Float32Array([-0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, -0.5]);
const LINE_SPHERE_XY = ((segment) => {
  const offset = glMatrix.glMatrix.toRadian(360 / segment);

  const vertices = new Float32Array(2/*xy*/ * segment);
  for(let i = 0; i < segment; ++i) {
    const radian = offset * i;
    vertices[i * 2] = Math.sin(radian);
    vertices[i * 2 + 1] = Math.cos(radian);
  }
  return vertices;
})(12);
