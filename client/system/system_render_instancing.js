// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemRenderInstancing = CES.System.extend({
  init: function() {
    const vs = WebGLCreateShader([
      "attribute vec3 world_pos;",
      "attribute vec2 tex_coord;",
      "attribute float tex_index;",

      "uniform mat4 vp_transform;",

      "varying vec2 fs_tex_coord;",
      "varying float fs_tex_index;",

      "void main() {",
      "  gl_Position = vp_transform * vec4(world_pos, 1.0);",
      "  fs_tex_coord = tex_coord;",
      "  fs_tex_index = tex_index;",
      "}",
    ].join("\n"), GL.VERTEX_SHADER);

    const fs = WebGLCreateShader([
      "precision mediump float;",

      "uniform sampler2D sampler_sprite[" + LIMIT_TEXTURE + "];",

      "varying vec2 fs_tex_coord;",
      "varying float fs_tex_index;",

      "vec4 FindTexture(int tex_index) {",
      "  for(int i = 0; i < " + LIMIT_TEXTURE + "; ++i) {",
      "    if(i == tex_index) {",
      "      return texture2D(sampler_sprite[i], fs_tex_coord);",
      "    }",
      "  }",
      "  return vec4(1.0);",
      "}",

      "void main() {",
      "  gl_FragColor = FindTexture(int(fs_tex_index));",
      "  if(0.0 == gl_FragColor.a) {",
      "    discard;",
      "  }",
      "}",
    ].join("\n"), GL.FRAGMENT_SHADER);

    const program = WebGLCreateProgram(vs, fs)
    const ib = WebGLCreateBuffer(GL.ELEMENT_ARRAY_BUFFER, BATCH_QUAD_I, GL.STATIC_DRAW);

    this.vs = vs;
    this.fs = fs;
    this.program = program;
    this.ib = ib;
    this.a_world_pos = GL.getAttribLocation(program, "world_pos");
    this.a_tex_coord = GL.getAttribLocation(program, "tex_coord");
    this.a_tex_index = GL.getAttribLocation(program, "tex_index");
    this.u_vp_transform = GL.getUniformLocation(program, "vp_transform");
    this.s_sprite = GL.getUniformLocation(program, "sampler_sprite");
  },
  update: function() {
    const system = this;
    const world = system.world;
    const instancings = world.getEntities("Instancing");
    if(0 === instancings.length) {
      return;
    }

    GL.useProgram(system.program);
    if(false === world.getEntities("Viewport").some(entity => {
      GL.uniformMatrix4fv(system.u_vp_transform, false, entity.getComponent("Viewport").transform_vp);
      return true;
    })) {
      return;
    }
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, system.ib);

    instancings.forEach(entity => {
      for(let subset of entity.getComponent("Instancing").subsets) {
        if(null === subset.vb) {
          subset.vb = WebGLCreateBuffer(GL.ARRAY_BUFFER, new Float32Array(subset.vertices), GL.STATIC_DRAW);
          subset.num_draw = subset.vertices.length / (6/*xyz uv ti*/ * 4/*quad*/);
        }
        GL.bindBuffer(GL.ARRAY_BUFFER, subset.vb);
        GL.vertexAttribPointer(system.a_world_pos, 3, GL.FLOAT, false, 24, 0);
        GL.vertexAttribPointer(system.a_tex_coord, 2, GL.FLOAT, false, 24, 12);
        GL.vertexAttribPointer(system.a_tex_index, 1, GL.FLOAT, false, 24, 20);

        const texture_indices = [];
        for(const texture of subset.textures) {
          const ti = texture_indices.length;
          texture_indices[texture_indices.length] = ti;

          GL.activeTexture(GL.TEXTURE0 + ti);
          GL.bindTexture(GL.TEXTURE_2D, texture.GetTexture());
        }
        GL.uniform1iv(system.s_sprite, texture_indices);

        GL.drawElements(GL.TRIANGLES, subset.num_draw * 6/*two polygon*/, GL.UNSIGNED_SHORT, 0);
      }
    });
  },
});
