// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentMadness = CES.Component.extend({
  name: "Madness",
  init: function(type, value) {
    this.type = type || "Once";
    this.value = value || 0;
  },
});
