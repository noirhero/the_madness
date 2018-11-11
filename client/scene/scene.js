// Copyright 2018 TAP, Inc. All Rights Reserved.

class Scene {
  constructor() {
    this.timer_ = new Timer();
    this.fps_ = new FramePerSecond();
  }

  Initialize() {
    return this;
  }

  Release() {
    return this;
  }

  Update() {
    this.fps_.Update(this.timer_.Update().Delta);
  }
}
