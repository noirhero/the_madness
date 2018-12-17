// Copyright 2018 TAP, Inc. All Rights Reserved.

function GenerateEntity(world, tile, tileset) {
  "use strict";

  const entity = new CES.Entity();

  if(!tileset.tiles) {
    entity.addComponent(new ComponentTexture()"../../data")
  }
  else {

  }
}

function TiledParse(world, json_text) {
  "use strict";

  const data = JSON.parse(json_text);

  data.layers.forEach(layer => {
    layer.data.forEach(tile => {
      if(0 === tile) {
        return;
      }

      data.tilesets.forEach(tileset => {
        const endgrid = tileset.firstgrid + tileset.tilecount - 1;
        if(tileset.firstgrid > tile || endgrid < tile) {
          return;
        }

        
      });
    });
  });
}
