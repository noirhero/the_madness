// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const ComponentCamera = CES.Component.extend({
  name: "Camera",
  init: function(type) {
    this.type = type || "follow";
    this.speed = 10;
  },
});
