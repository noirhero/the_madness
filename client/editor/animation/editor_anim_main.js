// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

function Main() {
  "use strict";

  WebGLInitialize();

  const scene_mng = new SceneManager(GetSceneInRegistry("EditorAnimScene").Initialize());
  scene_mng.Run();
}
