// Copyright 2018 TAP, Inc. All Rights Reserved.

function Main() {
  "use strict";

  const scene_mng = new SceneManager(GetSceneInRegistry("EditorAnimScene").Initialize());
  scene_mng.Run();
}
