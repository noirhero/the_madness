// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentPlayer = CES.Component.extend({
  name: "Player",
  init: function(id) {
    this.id = id;
    this.move_speed = 100;
    this.circle = new SAT.Circle(null, 20);
  }
});
