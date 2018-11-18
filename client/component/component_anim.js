// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentAnim = CES.Component.extend({
  name: "Anim",
  init: function(url, state, offset) {
    let anim = ANIMS[url];
    if(!anim) {
      ANIMS[url] = anim = new Animation(url);
    }

    this.anim = anim;
    this.state = state || "none";
    this.duration = offset || 0;
  },
});
