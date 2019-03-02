// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

function ReadFile(url, callback) {
  "use strict";

  const request = new XMLHttpRequest();
  request.onload = function() {
    console.log("On Load : " + url);
    callback(request.response);
  };
  request.open("GET", url, true);
  request.send();
}
