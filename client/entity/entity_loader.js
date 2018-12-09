// Copyright 2018 TAP, Inc. All Rights Reserved.

function EntityLoad(entity_obj) {
  "use strict";

  const components = [];

  (viewport_comp => {
    if(viewport_comp) {
      components[components.length] = new ComponentViewport();
    }
  })(entity_obj.viewport_comp);

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
      components[components.length] = new ComponentTexcoord();
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
