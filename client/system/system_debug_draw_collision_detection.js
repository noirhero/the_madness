// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemDebugDrawCollisionDetection = CES.System.extend({
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

      "void main() {",
      "  gl_FragColor = vec4(1, 0, 0, 1);",
      "}",
    ].join("\n"), GL.FRAGMENT_SHADER);

    const program = WebGLCreateProgram(vs, fs);

    this.a_local_pos = GL.getAttribLocation(program, "local_pos");
    this.u_wvp_transform = GL.getUniformLocation(program, "wvp_transform");
    this.program = program;
    this.vs = vs;
    this.fs = fs;
    this.box_vb = WebGLCreateBuffer(GL.ARRAY_BUFFER, LINE_QUAD_XY, GL.STATIC_DRAW);
    this.sphere_vb = WebGLCreateBuffer(GL.ARRAY_BUFFER, LINE_SPHERE_XY, GL.STATIC_DRAW);
    this.w_transform = glMatrix.mat4.create();
    this.wvp_transform = glMatrix.mat4.create();
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

    this.world.getEntities("Player").forEach(entity => {
      const circle = entity.getComponent("Player").circle;

      glMatrix.mat4.fromRotationTranslationScale(transform_w, IDENTITY_QUAT, [circle.pos.x, circle.pos.y, 0], [circle.r, circle.r, 1]);
      glMatrix.mat4.mul(transform_wvp, transform_vp, transform_w);
      GL.uniformMatrix4fv(u_wvp_transform, false, transform_wvp);
      GL.drawArrays(GL.LINE_LOOP, 0, LINE_SPHERE_XY.length / 2);
    });

    GL.bindBuffer(GL.ARRAY_BUFFER, this.box_vb);
    GL.vertexAttribPointer(this.a_local_pos, 2, GL.FLOAT, false, 8, 0);

    this.world.getEntities("Bounding", "Pos", "Scale").forEach(entity => {
      const box = entity.getComponent("Bounding").data;
      if(!box) {
        return;
      }

      glMatrix.mat4.fromRotationTranslationScale(transform_w, IDENTITY_QUAT, entity.getComponent("Pos").pos, entity.getComponent("Scale").scale);
      glMatrix.mat4.mul(transform_wvp, transform_vp, transform_w);
      GL.uniformMatrix4fv(u_wvp_transform, false, transform_wvp);
      GL.drawArrays(GL.LINE_LOOP, 0, 4);
    });
  },
});
