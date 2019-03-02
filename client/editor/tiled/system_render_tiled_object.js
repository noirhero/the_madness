// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemRenderTileObject = CES.System.extend({
  init: function() {
    const vs = WebGLCreateShader([
      "attribute vec2 local_pos;",

      "uniform mat4 wvp_transform;",

      "void main() {",
      "  gl_Position = wvp_transform * vec4(local_pos, -999.0, 1.0);",
      "}",
    ].join("\n"), GL.VERTEX_SHADER);

    const fs = WebGLCreateShader([
      "precision mediump float;",

      "uniform vec4 color;",

      "void main() {",
      "  gl_FragColor = color;",
      "}",
    ].join("\n"), GL.FRAGMENT_SHADER);

    const program = WebGLCreateProgram(vs, fs);

    this.a_local_pos = GL.getAttribLocation(program, "local_pos");
    this.u_wvp_transform = GL.getUniformLocation(program, "wvp_transform");
    this.u_color = GL.getUniformLocation(program, "color");
    this.program = program;
    this.vs = vs;
    this.fs = fs;
    this.box_vb = WebGLCreateBuffer(GL.ARRAY_BUFFER, LINE_QUAD_XY, GL.STATIC_DRAW);
    this.sphere_vb = WebGLCreateBuffer(GL.ARRAY_BUFFER, LINE_SPHERE_XY, GL.STATIC_DRAW);
    this.w_transform = glMatrix.mat4.create();
    this.wvp_transform = glMatrix.mat4.create();
    this.spawner_color = glMatrix.vec4.fromValues(0.6, 1, 0.658, 1);
    this.collision_color = glMatrix.vec4.fromValues(1, 0, 0, 1);
    this.bgm_color = glMatrix.vec4.fromValues(1, 1, 0, 1);
    this.camera_color = glMatrix.vec4.fromValues(1, 1, 1, 1);
    this.madness_color = glMatrix.vec4.fromValues(0.71, 0.31, 1, 1);
  },
  update: function() {
    const viewport_entities = this.world.getEntities("Viewport");
    if(0 === viewport_entities.length) {
      return;
    }

    const u_wvp_transform = this.u_wvp_transform;
    const transform_w = this.w_transform;
    const transform_wvp = this.wvp_transform;
    const transform_vp = viewport_entities[0].getComponent("Viewport").transform_vp;

    GL.useProgram(this.program);
    GL.bindBuffer(GL.ARRAY_BUFFER, this.sphere_vb);
    GL.disableVertexAttribArray(1);
    GL.disableVertexAttribArray(2);
    GL.vertexAttribPointer(this.a_local_pos, 2, GL.FLOAT, false, 8, 0);
    GL.uniform4fv(this.u_color, this.spawner_color);

    this.world.getEntities("Spawner", "Pos").forEach(entity => {
      glMatrix.mat4.fromRotationTranslationScale(transform_w, IDENTITY_QUAT, entity.getComponent("Pos").pos, [5, 5, 1]);
      glMatrix.mat4.mul(transform_wvp, transform_vp, transform_w);
      GL.uniformMatrix4fv(u_wvp_transform, false, transform_wvp);
      GL.drawArrays(GL.LINE_LOOP, 0, LINE_SPHERE_XY.length / 2);
    });

    GL.bindBuffer(GL.ARRAY_BUFFER, this.box_vb);
    GL.vertexAttribPointer(this.a_local_pos, 2, GL.FLOAT, false, 8, 0);

    this.world.getEntities("Pos", "Scale", "Obstacle").forEach(entity => {
      glMatrix.mat4.fromRotationTranslationScale(transform_w, IDENTITY_QUAT, entity.getComponent("Pos").pos, entity.getComponent("Scale").scale);
      glMatrix.mat4.mul(transform_wvp, transform_vp, transform_w);
      GL.uniformMatrix4fv(u_wvp_transform, false, transform_wvp);
      GL.uniform4fv(this.u_color, this.collision_color);
      GL.drawArrays(GL.LINE_LOOP, 0, 4);
    });

    this.world.getEntities("Pos", "Scale", "Bounding", "Sound").forEach(entity => {
      glMatrix.mat4.fromRotationTranslationScale(transform_w, IDENTITY_QUAT, entity.getComponent("Pos").pos, entity.getComponent("Scale").scale);
      glMatrix.mat4.mul(transform_wvp, transform_vp, transform_w);
      GL.uniformMatrix4fv(u_wvp_transform, false, transform_wvp);
      GL.uniform4fv(this.u_color, this.bgm_color);
      GL.drawArrays(GL.LINE_LOOP, 0, 4);
    });

    this.world.getEntities("Pos", "Scale", "Bounding", "Camera").forEach(entity => {
      glMatrix.mat4.fromRotationTranslationScale(transform_w, IDENTITY_QUAT, entity.getComponent("Pos").pos, entity.getComponent("Scale").scale);
      glMatrix.mat4.mul(transform_wvp, transform_vp, transform_w);
      GL.uniformMatrix4fv(u_wvp_transform, false, transform_wvp);
      GL.uniform4fv(this.u_color, this.camera_color);
      GL.drawArrays(GL.LINE_LOOP, 0, 4);
    });

    this.world.getEntities("Pos", "Scale", "Bounding", "Madness").forEach(entity => {
      glMatrix.mat4.fromRotationTranslationScale(transform_w, IDENTITY_QUAT, entity.getComponent("Pos").pos, entity.getComponent("Scale").scale);
      glMatrix.mat4.mul(transform_wvp, transform_vp, transform_w);
      GL.uniformMatrix4fv(u_wvp_transform, false, transform_wvp);
      GL.uniform4fv(this.u_color, this.madness_color);
      GL.drawArrays(GL.LINE_LOOP, 0, 4);
    });
  },
});
