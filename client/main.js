// Copyright 2018 TAP, Inc. All Rights Reserved.

function Main() {
  "use strict";

  WebGLInitialize();

  const scene_mng = new SceneManager(GetSceneInRegistry("Game", "data/scene/scene_test.json").Initialize());
  scene_mng.Run();
}
