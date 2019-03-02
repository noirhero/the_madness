// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemBGM = CES.System.extend({
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

    this.world.getEntities("Sound", "Bounding", "Pos", "Scale").forEach(entity => {
      const sound_comp = entity.getComponent("Sound");
      const bounding_comp = entity.getComponent("Bounding");
      if(!bounding_comp.data) {
        const pos = entity.getComponent("Pos").pos;
        const scale = entity.getComponent("Scale").scale;
        bounding_comp.data = new SAT.Box(new SAT.V(pos[0] - scale[0] * 0.5, pos[1] - scale[1] * 0.5), scale[0], scale[1]).toPolygon();
      }

      if(player_comp.bgm_comp === sound_comp) {
        if(false === SAT.pointInPolygon(this.player_pos, bounding_comp.data)) {
          player_comp.bgm_comp.data.fade(1, 0, 3000);
          player_comp.bgm_comp = null;
        }
      }
      else {
        if(true === SAT.pointInPolygon(this.player_pos, bounding_comp.data)) {
          if(!sound_comp.data) {
            sound_comp.data = new Howl({
              src: ["data/sound/" + sound_comp.file + ".ogg", "data/sound/" + sound_comp.file + ".mp4"],
            });
            sound_comp.data.play();
            sound_comp.data.fade(0, 1, 3000);
          }
          else {
            sound_comp.data.fade(0, 1, 3000);
          }

          if(player_comp.bgm_comp && player_comp.bgm_comp.data) {
            player_comp.bgm_comp.data.fade(1, 0, 3000);
          }
          player_comp.bgm_comp = sound_comp;
        }
      }
    });
  },
});
