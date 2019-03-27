// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const SystemMovementCollisionDetection = CES.System.extend({
  init: function() {
    this.response = new SAT.Response();
  },
  update: function() {
    const world = this.world;

    let player_pos = null;
    let player_circle = null;
    if(false === world.getEntities("Player", "Pos").some(entity => {
      player_pos = entity.getComponent("Pos").pos;
      player_circle = entity.getComponent("Player").circle;
      player_circle.pos.x = player_pos[0];
      player_circle.pos.y = player_pos[1];
      return true;
    })) {
      return;
    }

    const response = this.response;
    world.getEntities("Obstacle", "Pos", "Scale").forEach(entity => {
      const obstacle_comp = entity.getComponent("Obstacle")
      if(!obstacle_comp.data) {
        const pos = entity.getComponent("Pos").pos;
        const scale = entity.getComponent("Scale").scale;
        obstacle_comp.data = new SAT.Box(new SAT.V(pos[0] - scale[0] * 0.5, pos[1] - scale[1] * 0.5), scale[0], scale[1]).toPolygon();
      }

      if(true === SAT.testPolygonCircle(obstacle_comp.data, player_circle, response)) {
        player_pos[0] += response.overlapV.x;
        player_pos[1] += response.overlapV.y;

        response.clear();
      }
    });
  },
});
