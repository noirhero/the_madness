// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

class Timer {
  constructor() {
    this.prev_ = Date.now();
    this.delta_ = 0;
    this.delta_ms_ = 0;
  }

  Update() {
    const now = Date.now();
    this.delta_ms_ = now - this.prev_;
    this.delta_ = this.delta_ms_ * 0.001;
    this.prev_ = now;

    return this;
  }

  get Delta() {
    return this.delta_;
  }

  get DeltaMS() {
    return this.delta_ms_;
  }
}
