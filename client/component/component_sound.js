// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

const ComponentSound = CES.Component.extend({
  name: "Sound",
  init: function(file) {
    this.file = file;
    this.data = null;
  },
});
