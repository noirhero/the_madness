// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

class SceneManager {
  constructor(initial_scene) {
    this.current_scene_ = initial_scene;
    this.update_time_ = Date.now();

    this.check_interval_fn_ = () => {
      const delta = Date.now() - this.update_time_;
      if(10 > delta) {
        Frame(this.check_interval_fn_);
        return;
      }

      Frame(this.update_fn_);
    };
    this.update_fn_ = () => {
      WebGLUpdate();

      const next_scene = this.current_scene_.Update();
      if(next_scene) {
        this.current_scene_.Release();
        this.current_scene_ = next_scene.Initialize();
      }

      this.update_time_ = Date.now();
      Frame(this.check_interval_fn_);
    };
  }

  Run() {
    Frame(this.check_interval_fn_);
  }
}
