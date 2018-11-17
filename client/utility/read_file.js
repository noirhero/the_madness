// Copyright 2018 TAP, Inc. All Rights Reserved.

function ReadFile(url, callback) {
  "use strict";

  const request = new XMLHttpRequest();
  request.onload = function() {
    callback(request.response);
  };
  request.open("GET", url, true);
  request.send();
}
