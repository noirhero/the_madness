// Copyright 2018 TAP, Inc. All Rights Reserved.

class EditorEntityScene extends Scene {
  constructor() {
    super();

    this.controlKit_ = new ControlKit();
  }

  Initialize() {
    let controlKit = this.controlKit_;

    controlKit.addPanel({
      fixed: false,
      label: "Entity",
    });

    return this;
  }

  Update() {
    super.Update();

    this.controlKit_.update();
  }
}
