// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemRenderTileObject = CES.System.extend({
  init: function() {
    const vs = WebGLCreateShader([
      "attribute vec2 local_pos;",

      "uniform mat4 wvp_transform;",

      "void main() {",
      //"  gl_Position = wvp_transform * vec4(local_pos, 0.0, 1.0);",
      "  gl_Position = vec4(local_pos, 0.0, 1.0);",
      "}",
    ].join("\n"), GL.VERTEX_SHADER);

    const fs = WebGLCreateShader([
      "precision mediump float;",

      "uniform vec4 color;",

      "void main() {",
      "  gl_FragColor = vec4(1, 0, 1, 1);",
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

    const box_vb = this.box_vb;
    const sphere_vb = this.sphere_vb;

    GL.useProgram(this.program);
    GL.disableVertexAttribArray(1);
    GL.disableVertexAttribArray(2);
    GL.vertexAttribPointer(this.a_local_pos, 2, GL.FLOAT, false, 0, 0);

    this.world.getEntities("Spawner", "Pos").forEach(entity => {
      //glMatrix.mat4.fromRotationTranslationScale(transform_w, IDENTITY_QUAT, entity.getComponent("Pos").pos, [10, 10, 1]);
      glMatrix.mat4.fromRotationTranslationScale(transform_w, IDENTITY_QUAT, [0, 0, 0], [1, 1, 1]);
      glMatrix.mat4.mul(transform_wvp, transform_w, transform_vp);
      GL.uniformMatrix4fv(u_wvp_transform, false, transform_vp);
      GL.bindBuffer(GL.ARRAY_BUFFER, box_vb);
      GL.drawArrays(GL.LINE_LOOP, 0, 8);

      return;
    });
  }
});
