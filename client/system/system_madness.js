// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemMadness = CES.System.extend({
  init: function() {
    this.player_pos = new SAT.V();
  },
  update: function() {
    const player_entities = this.world.getEntities("Player", "Pos");
    if(0 === player_entities.length) {
      return;
    }

    const player_comp = player_entities[0].getComponent("Player");
    const player_pos = player_entities[0].getComponent("Pos").pos;
    this.player_pos.x = player_pos[0];
    this.player_pos.y = player_pos[1];

    this.world.getEntities("Madness", "Pos", "Scale").forEach(entity => {
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
