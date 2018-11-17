// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentAnim = CES.Component.extend({
  name: "Anim",
  init: function(url, state, offset, reverse_x) {
    let anim = ANIMS[url];
    if(!anim) {
      ANIMS[url] = anim = new Animation(url);
    }

    this.anim = anim;
    this.state = state || "none";
    this.duration = offset || 0;
    this.reverse_x = reverse_x || false;
  },
});
