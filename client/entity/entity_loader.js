// Copyright 2018 TAP, Inc. All Rights Reserved.

function EntityLoad(entity_obj) {
  "use strict";

  const components = [];

  (viewport_comp => {
    if(viewport_comp) {
      components[components.length] = new ComponentViewport();
    }
  })(entity_obj.viewport_comp);

  (mic_comp => {
    if(mic_comp) {
      components[components.length] = new ComponentMic();
    }
  })(entity_obj.mic_comp);

  (websocket_comp => {
    if(websocket_comp) {
      components[components.length] = new ComponentWebsocket();
    }
  })(entity_obj.websocket_comp);

  (scale_comp => {
    if(scale_comp) {
      components[components.length] = new ComponentScale(scale_comp.x, scale_comp.y, scale_comp.z);
    }
  })(entity_obj.scale_comp);

  (rot_comp => {
    if(rot_comp) {
      components[components.length] = new ComponentRot(rot_comp.x, rot_comp.y, rot_comp.z);
    }
  })(entity_obj.rot_comp);

  (pos_comp => {
    if(pos_comp) {
      components[components.length] = new ComponentPos(pos_comp.x, pos_comp.y, pos_comp.z);
    }
  })(entity_obj.pos_comp);

  (texcoord_comp => {
    if(texcoord_comp) {
      const values = texcoord_comp.values;
      if(values) {
        components[components.length] = new ComponentTexcoord([
          glMatrix.vec2.fromValues(values[0][0], values[0][1]),
          glMatrix.vec2.fromValues(values[1][0], values[1][1]),
          glMatrix.vec2.fromValues(values[2][0], values[2][1]),
          glMatrix.vec2.fromValues(values[3][0], values[3][1]),
        ]);
      }
      else {
        components[components.length] = new ComponentTexcoord();
      }
    }
  })(entity_obj.texcoord_comp);

  (texture_comp => {
    if(texture_comp) {
      components[components.length] = new ComponentTexture(texture_comp.url);
    }
  })(entity_obj.texture_comp);

  (anim_comp => {
    if(!anim_comp) {
      return;
    }

    const component = new ComponentAnim(anim_comp.url);
    component.state = anim_comp.state;
    component.duration = anim_comp.duration;
    components[components.length] = component;
  })(entity_obj.anim_comp);

  (bounding_comp => {
    if(bounding_comp) {
      components[components.length] = new ComponentBouding(bounding_comp.type);
    }
  })(entity_obj.bounding_comp);

  (sound_comp => {
    if(sound_comp) {
      components[components.length] = new ComponentSound(sound_comp.file);
    }
  })(entity_obj.sound_comp);

  (spawner_comp => {
    if(spawner_comp) {
      components[components.length] = new ComponentSpawner(spawner_comp.type, spawner_comp.entity_name);
    }
  })(entity_obj.spawner_comp);

  const num_components = components.length;
  if(0 === num_components) {
    return null;
  }

  const entity = new CES.Entity();
  for(let i = 0; i < num_components; ++i) {
    entity.addComponent(components[i]);
  }
  return entity;
}
