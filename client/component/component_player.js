// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentPlayer = CES.Component.extend({
  name: "Player",
  init: function(id) {
    this.id = id;
    this.madness = 100;
    this.move_speed = 100;
    this.circle = new SAT.Circle(null, 20);
    this.bgm_comp = null;
  }
});
