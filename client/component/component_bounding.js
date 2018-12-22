// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentBouding = CES.Component.extend({
  name: "Bounding",
  init: function(type) {
    this.type = type || "BOX";
    this.data = null;
  },
});
