// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

function GenerateTileEntity(world, tile, tileset, x, y, z) {
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
    const i = tile - tileset.firstgid;
    const tw = tileset.tilewidth / tileset.imagewidth;
    const th = tileset.tileheight / tileset.imageheight;
    const tx = Math.floor(i % tileset.columns) * tw;
    const ty = 1 - Math.floor(i / tileset.columns) * th;

    entity.addComponent(new ComponentPos(x + tileset.tilewidth / 2, y + tileset.tileheight / 2, z));
    entity.addComponent(new ComponentScale(tileset.tilewidth, tileset.tileheight));
    entity.addComponent(new ComponentTexture("../../data/tiled/" + tileset.image));
    entity.addComponent(new ComponentTexcoord([
      glMatrix.vec2.fromValues(tx, ty),
      glMatrix.vec2.fromValues(tx + tw, ty),
      glMatrix.vec2.fromValues(tx, ty - th),
      glMatrix.vec2.fromValues(tx + tw, ty - th),
    ]));
  }

  world.addEntity(entity);
}

function TileLayerParse(world, data, layer) {
  "use strict";

  let i = 0;
  let z = 0;
  if(layer.properties) {
    layer.properties.some(property => {
      if("z" != property.name) {
        return false;
      }

      z = property.value;
      return true;
    });
  }

  layer.data.forEach(tile => {
    if(0 === tile) {
      ++i;
      return;
    }

    const x = Math.floor(i % data.width) * data.tilewidth;
    const y = (Math.max(1, data.height - 1) * data.tileheight) - Math.floor(i / data.width) * data.tileheight;
    ++i;

    data.tilesets.forEach(tileset => {
      const end_grid = tileset.firstgid + tileset.tilecount - 1;
      if(tileset.firstgid > tile || end_grid < tile) {
        return;
      }

      GenerateTileEntity(world, tile, tileset, x, y, z);
    });
  });
}

function ObjectLayerParse(world, data, layer, height) {
  "use strict";

  if("collision" == layer.name) {
    layer.objects.forEach(object => {
      const entity = new CES.Entity();
      entity.addComponent(new ComponentPos(object.x + object.width * 0.5, height - object.y - object.height / 2));
      entity.addComponent(new ComponentScale(object.width, object.height));
      entity.addComponent(new ComponentObstacle());
      world.addEntity(entity);
    });
  }
  else if("spawn" == layer.name) {
    layer.objects.forEach(object => {
      let entity_name = null;
      if(object.properties) {
        object.properties.some(property => {
          if("entity" == property.name) {
            entity_name = property.value;
            return true;
          }
          return false;
        });
      }

      const entity = new CES.Entity();
      entity.addComponent(new ComponentPos(object.x, height - object.y));
      entity.addComponent(new ComponentSpawner(object.name, entity_name));
      world.addEntity(entity);
    });
  }
  else if("bgm" == layer.name) {
    layer.objects.forEach(object => {
      const entity = new CES.Entity();
      entity.addComponent(new ComponentPos(object.x + object.width * 0.5, height - object.y - object.height / 2));
      entity.addComponent(new ComponentScale(object.width, object.height));
      entity.addComponent(new ComponentBouding());

      if(object.properties) {
        object.properties.some(property => {
          if("file" == property.name) {
            entity.addComponent(new ComponentSound(property.value));
            world.addEntity(entity);
            return true;
          }
          return false;
        });
      }
    });
  }
  else if("camera" == layer.name) {
    layer.objects.forEach(object => {
      const entity = new CES.Entity();
      entity.addComponent(new ComponentPos(object.x + object.width * 0.5, height - object.y - object.height / 2));
      entity.addComponent(new ComponentScale(object.width, object.height));
      entity.addComponent(new ComponentBouding());
      entity.addComponent(new ComponentCamera(object.type));
      world.addEntity(entity);
    });
  }
  else if("madness" == layer.name) {
    layer.objects.forEach(object => {
      const entity = new CES.Entity();
      entity.addComponent(new ComponentPos(object.x + object.width * 0.5, height - object.y - object.height / 2));
      entity.addComponent(new ComponentScale(object.width, object.height));
      entity.addComponent(new ComponentBouding());

      if(object.properties) {
        object.properties.some(property => {
          if("value" == property.name) {
            entity.addComponent(new ComponentMadness(object.type, property.value));
            world.addEntity(entity);
            return true;
          }
          return false;
        });
      }
    });
  }
  else if("instancing" == layer.name) {
    layer.objects.forEach(object => {
      const entity = new CES.Entity();
      entity.addComponent(new ComponentInstancingBuild(object.x, object.y, object.width, object.height));
      world.addEntity(entity);
    });
  }
}

function TiledParse(world, json_text) {
  "use strict";

  const data = JSON.parse(json_text);

  data.layers.forEach(layer => {
    if(layer.data) {
      TileLayerParse(world, data, layer);
    }
    else if(layer.objects) {
      ObjectLayerParse(world, data, layer, data.tileheight * data.height);
    }
  });
}
