// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemRenderSprite = CES.System.extend({
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

    const vb = WebGLCreateBuffer(GL.ARRAY_BUFFER, BATCH_QUAD_XYZIUV, GL.DYNAMIC_DRAW);
    const ib = WebGLCreateBuffer(GL.ELEMENT_ARRAY_BUFFER, BATCH_QUAD_I, GL.STATIC_DRAW);

    this.vs = vs;
    this.fs = fs;
    this.program = program;
    this.vb = vb;
    this.ib = ib;
    this.a_world_pos = GL.getAttribLocation(program, "world_pos");
    this.a_tex_coord = GL.getAttribLocation(program, "tex_coord");
    this.a_tex_index = GL.getAttribLocation(program, "tex_index");
    this.u_vp_transform = GL.getUniformLocation(program, "vp_transform");
    this.s_sprite = GL.getUniformLocation(program, "sampler_sprite");
  },
  update: function() {
    const world = this.world;
    const num_max_offset = BATCH_QUAD_XYZIUV.length;

    const program = this.program;
    const vb = this.vb;
    const ib = this.ib;
    const a_world_pos = this.a_world_pos;
    const a_tex_coord = this.a_tex_coord;
    const a_tex_index = this.a_tex_index;
    const u_vp_transform = this.u_vp_transform;
    const s_sprite = this.s_sprite;

    let num_draw = 0;
    let offset = 0;
    let bind_textures = [];
    let bind_texture_indices = [];

    let is_first = true;
    function Draw() {
      if(true === is_first) {
        is_first = false;

        world.getEntities("Viewport").some(function(entity) {
          const viewport = entity.getComponent("Viewport");

          GL.viewport(0, 0, viewport.width, viewport.height);
          GL.enable(GL.DEPTH_TEST);
          GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

          GL.useProgram(program);
          GL.uniformMatrix4fv(u_vp_transform, false, viewport.transform_vp);
          GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ib);
          GL.bindBuffer(GL.ARRAY_BUFFER, vb);
          GL.enableVertexAttribArray(2);
          GL.vertexAttribPointer(a_world_pos, 3, GL.FLOAT, false, 24, 0);
          GL.vertexAttribPointer(a_tex_coord, 2, GL.FLOAT, false, 24, 12);
          GL.vertexAttribPointer(a_tex_index, 1, GL.FLOAT, false, 24, 20);

          return true;
        });
      }

      GL.bufferSubData(GL.ARRAY_BUFFER, 0, BATYCH_QUAD_XYZIUV);

      const num_bind_textures = bind_textures.length;
      for(let bi = 0; bi < num_bind_textures; ++bi) {
        GL.activeTexture(GL.TEXTURE0 + bi);
        GL.bindTexture(GL.TEXTURE_2D, bind_textures[bi].GetTexture());
      }
      GL.uniform1iv(s_sprite, bind_texture_indices);

      GL.drawElements(GL.TRIANGLES, num_draw * 6/*two polygon*/, GL.UNSIGNED_SHORT, 0);

      num_draw = 0;
      offset = 0;
      bind_textures.length = 0;
      bind_texture_indices.length = 0;
    }

    let scale = null;
    let rot = quat.create();
    let pos = null;
    let texcoord = null;
    let current_texture = null;
    let world_transform = mat4.create();
    let world_pos = vec3.create();
    let comp_rot = null;

    world.getEntities("Scale", "Pos", "Texture", "Texcoord").forEach(function(entity) {
      current_texture = entity.getComponent("Texture").texture;
      if(false === current_texture.IsRenderable()) {
        return;
      }

      ++num_draw;

      let texture_index = null;
      let num_bind_textures = bind_textures.length;
      for(let bi = 0; bi < num_bind_textures; ++bi) {
        if(bind_textures[bi] === current_texture) {
          texture_index = bi;
          break;
        }
      }

      if(null === texture_index) {
        if(LIMIT_TEXTURE <= num_bind_textures) {
          Draw();
        }

        bind_textures[num_bind_textures] = current_texture;
        bind_texture_indices[num_bind_textures] = num_bind_textures;
        texture_index = num_bind_textures;
      }

      scale = entity.getComponent("Scale").scale;
      pos = entity.getComponent("Pos").pos;
      texcoord = entity.getComponent("Texcoord").texcoord;

      comp_rot = entity.getComponent("Rot");
      if(comp_rot) {
        quat.fromEuler(rot, comp_rot.rot[0], comp_rot.rot[1], comp_rot.rot[2]);
        mat4.fromRotationTranslationScale(world_transform, rot, pos, scale);
      }
      else {
        mat4.fromRotationTranslationScale(world_transform, IDENTITY_QUAT, pos, scale);
      }

      for(let i = 0; i < 4; ++i) {
        vec3.transformMat4(world_pos, QUAD_LOCAL_POS[i], world_transform);

        BATCH_QUAD_XYZIUV[offset++] = world_pos[0];
        BATCH_QUAD_XYZIUV[offset++] = world_pos[1];
        BATCH_QUAD_XYZIUV[offset++] = (0 === pos[2]) ? world_transform[13] : pos[2];
        BATCH_QUAD_XYZIUV[offset++] = texcoord[i][0];
        BATCH_QUAD_XYZIUV[offset++] = texcoord[i][1];
        BATCH_QUAD_XYZIUV[offset++] = texture_index;
      }

      if(num_max_offset <= offset) {
        Draw();
      }
    });

    if(0 < num_draw) {
      Draw();
    }
  }
});
