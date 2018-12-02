// Copyright 2018 TAP, Inc. All Rights Reserved.

function GetSceneInRegistry(name) {
  switch(name) {
  case "EditorAnimScene": return new EditorAnimScene();
  case "EditorEntityScene": return new EditorEntityScene();
  default: return new Scene();
  }
}
