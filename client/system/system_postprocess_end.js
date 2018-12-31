// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemPostprocessEnd = CES.System.extend({
  init: function() {
    const vs = WebGLCreateShader([
      "attribute vec2 proj_pos;",
      "attribute vec2 tex_coord;",

      "varying vec2 fs_tex_coord;",

      "void main() {",
      "  gl_Position = vec4(proj_pos, 0.0, 1.0);",
      "  fs_tex_coord = tex_coord;",
      "}",
    ].join("\n"), GL.VERTEX_SHADER);

    const fs = WebGLCreateShader([
      "precision mediump float;",

      "uniform vec4 displacement_scale;",

      "uniform sampler2D sampler_scene;",
      "uniform sampler2D sampler_displacement;",

      "varying vec2 fs_tex_coord;",

      "void main() {",
      "  vec2 offset = texture2D(sampler_displacement, fs_tex_coord + displacement_scale.xy).rg;",
      "  offset -= 0.5;",
      "  offset *= displacement_scale.zw;",
      "  gl_FragColor = texture2D(sampler_scene, fs_tex_coord + offset);",
      "}",
    ].join("\n"), GL.FRAGMENT_SHADER);

    const program = WebGLCreateProgram(vs, fs);

    const vb = WebGLCreateBuffer(GL.ARRAY_BUFFER, new Float32Array([
      -1, 1, 0, 1,
      1, 1, 1, 1,
      -1, -1, 0, 0,
      1, -1, 1, 0,
    ]), GL.STATIC_DRAW);
    const ib = WebGLCreateBuffer(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 2, 1, 3]), GL.STATIC_DRAW);

    this.vs = vs;
    this.fs = fs;
    this.program = program;
    this.vb = vb;
    this.ib = ib;

    this.a_proj_pos = GL.getAttribLocation(program, "proj_pos");
    this.a_tex_coord = GL.getAttribLocation(program, "tex_coord");
    this.u_displacement_scale = GL.getUniformLocation(program, "displacement_scale");
    this.s_scene = GL.getUniformLocation(program, "sampler_scene");
    this.s_diplacement = GL.getUniformLocation(program, "sampler_displacement");

    this.displacement_scale = glMatrix.vec4.create();
    this.displacement_texture = new Texture("data/texture/displacement.png");
  },
  update: function(delta) {
    const player_entites = this.world.getEntities("Player");
    if(0 === player_entites.length) {
      return;
    }

    const player_madness = player_entites[0].getComponent("Player").madness;

    if(false === this.displacement_texture.IsRenderable()) {
      return;
    }

    GL.disable(GL.DEPTH_TEST);
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);

    GL.useProgram(this.program);

    this.displacement_scale[0] += Math.RangeRandom(0, 100 - player_madness) * delta;
    this.displacement_scale[2] = 1 / (CANVAS_W * 0.5);
    this.displacement_scale[3] = 1 / (CANVAS_H * 0.5);
    GL.uniform4fv(this.u_displacement_scale, this.displacement_scale);

    GL.activeTexture(GL.TEXTURE0);
    GL.bindTexture(GL.TEXTURE_2D, SCENE_TEXTURE);
    GL.uniform1i(this.s_scene, 0);

    GL.activeTexture(GL.TEXTURE1);
    GL.bindTexture(GL.TEXTURE_2D, this.displacement_texture.GetTexture());
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.REPEAT);
    GL.uniform1i(this.s_diplacement, 1);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.ib);
    GL.bindBuffer(GL.ARRAY_BUFFER, this.vb);
    GL.vertexAttribPointer(this.a_proj_pos, 2, GL.FLOAT, false, 16, 0);
    GL.vertexAttribPointer(this.a_tex_coord, 2, GL.FLOAT, false, 16, 8);
    GL.disableVertexAttribArray(2);

    GL.drawElements(GL.TRIANGLES, 6, GL.UNSIGNED_SHORT, 0);
  },
});
