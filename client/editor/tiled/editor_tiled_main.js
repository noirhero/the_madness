// Copyright 2018 TAP, Inc. All Rights Reserved.

function Main() {
  "use strict";

  WebGLInitialize();

  const scene_mng = new SceneManager(GetSceneInRegistry("EditorTiledScene").Initialize());
  scene_mng.Run();
}
