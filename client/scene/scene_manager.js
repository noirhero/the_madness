// Copyright 2018 TAP, Inc. All Rights Reserved.

class SceneManager {
  constructor(initial_scene) {
    this.current_scene_ = initial_scene;
  }

  Run() {
    const next_scene = this.current_scene_.Update();
    if(next_scene) {
      // Todo : change scene.
    }

    Frame(this.Run.bind(this));
  }
}
