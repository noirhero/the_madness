// Copyright 2018 TAP, Inc. All Rights Reserved.

function GenerateEntity(world, tile, tileset, x, y, z, w, h) {
  "use strict";

  const entity = new CES.Entity();

  if(tileset.tiles) {
    tileset.tiles.some(tile_data => {
      const id = tileset.firstgid + tile_data.id;
      if(tile !== id) {
        return false;
      }

      entity.addComponent(new ComponentPos(x + tile_data.imagewidth / 2, y + tile_data.imageheight / 2, z));
      entity.addComponent(new ComponentScale(tile_data.imagewidth, tile_data.imageheight));
      entity.addComponent(new ComponentTexture("../../data/tiled/" + tile_data.image));
      entity.addComponent(new ComponentTexcoord());
      return true;
    });
  }
  else {

  }

  world.addEntity(entity);
}

function TiledParse(world, json_text) {
  "use strict";

  const data = JSON.parse(json_text);

  data.layers.forEach(layer => {
    let i = 0;
    let z = 0;
    layer.properties.some(property => {
      if("z" != property.name) {
        return false;
      }

      z = property.value;
      return true;
    });

    layer.data.forEach(tile => {
      if(0 === tile) {
        ++i;
        return;
      }

      const x = Math.floor(i % data.width) * data.tilewidth;
      const y = (data.height * data.tileheight) - Math.floor(i / data.width) * data.tileheight;
      ++i;

      data.tilesets.forEach(tileset => {
        const end_grid = tileset.firstgrid + tileset.tilecount - 1;
        if(tileset.firstgrid > tile || end_grid < tile) {
          return;
        }

        GenerateEntity(world, tile, tileset, x, y, z, data.tilewidth, data.tileheight);
      });
    });
  });
}
