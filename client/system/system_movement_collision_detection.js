// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemMovementCollisionDetection = CES.System.extend({
  init: function() {
    this.response = new SAT.Response();
  },
  update: function() {
    const player_entites = this.world.getEntities("Player", "Pos");
    if(0 === player_entites.length) {
      return;
    }

    const player_pos = player_entites[0].getComponent("Pos").pos;
    const player_circle = player_entites[0].getComponent("Player").circle;
    const response = this.response;

    player_circle.pos.x = player_pos[0];
    player_circle.pos.y = player_pos[1];

    this.world.getEntities("Obstacle", "Pos", "Scale").forEach(entity => {
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
