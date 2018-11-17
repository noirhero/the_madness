// Copyright 2018 TAP, Inc. All Rights Reserved.

var ANIMS = {};

function Animation(url) {
  "use strict";

  let data = null;

  function OnLoadAnimation(json_text) {
    data = JSON.parse(json_text);
  }
  ReadFile(url);
}
