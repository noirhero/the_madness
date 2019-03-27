// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemMadness = CES.System.extend({
  init: function() {
    this.player_pos = new SAT.V();
  },
  update: function() {
    const world = this.world;
    const player_pos = this.player_pos;

    let player_comp = null;
    if(false === world.getEntities("Player", "Pos").some(entity => {
      player_comp = entity.getComponent("Player");

      const pos = entity.getComponent("Pos").pos;
      player_pos.x = pos[0];
      player_pos.y = pos[1];

      return true;
    })) {
      return;
    }

    world.getEntities("Madness", "Pos", "Scale").forEach(entity => {
      const madness_comp = entity.getComponent("Madness");
      if("once" == madness_comp.type && true === madness_comp.is_use) {
        return;
      }

      const bounding_comp = entity.getComponent("Bounding");
      if(!bounding_comp.data) {
        const pos = entity.getComponent("Pos").pos;
        const scale = entity.getComponent("Scale").scale;
        bounding_comp.data = new SAT.Box(new SAT.V(pos[0] - scale[0] * 0.5, pos[1] - scale[1] * 0.5), scale[0], scale[1]).toPolygon();
      }

      if(false === SAT.pointInPolygon(this.player_pos, bounding_comp.data)) {
        return;
      }

      player_comp.madness += madness_comp.value;
      madness_comp.is_use = true;
      console.log("Player madness : " + player_comp.madness);
    });
  },
});
