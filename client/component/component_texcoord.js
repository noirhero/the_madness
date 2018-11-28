// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentTexcoord = CES.Component.extend({
  name: "Texcoord",
  init: function() {
    this.values = [
      vec2.clone(EMPTY_TEXCOORD[0]),
      vec2.clone(EMPTY_TEXCOORD[1]),
      vec2.clone(EMPTY_TEXCOORD[2]),
      vec2.clone(EMPTY_TEXCOORD[3]),
    ];
  }
});
