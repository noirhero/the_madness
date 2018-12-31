// Copyright 2018 TAP, Inc. All Rihghts Reserved.

Math.RangeRandom = function(min, max) {
  "use strict";
  return Math.random() * (max - min) + min;
};

Math.RangeRandomInt = function(min, max) {
  "use strict";
  return Math.floor(Math.RangeRandom(min, max));
};
