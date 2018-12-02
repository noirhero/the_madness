// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemAnimation = CES.System.extend({
  update: function(delta) {
    let anim_comp = null;
    this.world.getEntities("Anim", "Texcoord").forEach(function(entity) {
      anim_comp = entity.getComponent("Anim");
      anim_comp.duration += delta;

      entity.getComponent("Texcoord").values = anim_comp.anim.GetTexCoord(anim_comp.state, anim_comp.duration);
    });
  },
});
