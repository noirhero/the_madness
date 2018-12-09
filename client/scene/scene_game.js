// Copyright 2018 TAP, Inc. All Rihgts Reserved.

class GameScene extends Scene {
  constructor(url) {
    super();

    ReadFile(url, json_text => {
      const scene_data = JSON.parse(json_text);
    });
  }
}
