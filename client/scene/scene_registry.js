// Copyright 2018 TAP, Inc. All Rights Reserved.

function GetSceneInRegistry(name, url) {
  switch(name) {
  case "EditorAnimScene": return new EditorAnimScene();
  case "EditorEntityScene": return new EditorEntityScene();
  case "Game": return new GameScene(url);
  default: return new Scene();
  }
}
