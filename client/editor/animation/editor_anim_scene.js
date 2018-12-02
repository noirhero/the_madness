// Copyright 2018 TAP, Inc. All Rights Reserved.

class EditorAnimScene extends Scene {
  constructor() {
    super();

    const entity = new CES.Entity();
    entity.addComponent(new ComponentViewport());
    entity.addComponent(new ComponentScale(100, 100));
    entity.addComponent(new ComponentPos());
    entity.addComponent(new ComponentTexcoord());

    const world = new CES.World();
    world.addSystem(new SystemViewport);
    world.addSystem(new SystemAnimation);
    world.addSystem(new SystemRenderSprite);
    world.addEntity(entity);

    this.entity_ = entity;
    this.world_ = world;
    this.controlKit_ = new ControlKit();
    this.edit_data_ = {};
  }

  Initialize() {
    let entity = this.entity_;
    let contolKit = this.controlKit_;
    let edit_data = this.edit_data_;

    function OnLoadAnimationTextFile(event) {
      const anim_data = AnimationParse(event.target.result);
      const anim_blob = new Blob([JSON.stringify(anim_data, null, " ")], {type: "application/json"});
      const anim_url = URL.createObjectURL(anim_blob);

      entity.removeComponent("Anim");
      entity.addComponent(new ComponentAnim(anim_url));

      edit_data = {};
      for(let i in anim_data) {
        edit_data[i] = {
          name: i,
          seconds: {},
        };

        const anim_info = anim_data[i];
        const num_frames = anim_info.frames.length;
        for(let i_frame = 0; i_frame < num_frames; ++i_frame) {
          const frame_info = anim_info.frames[i_frame];
          edit_data[i].seconds[i_frame] = frame_info.end - frame_info.start;
        }
      }

      const anim_panel = contolKit.addPanel({
        fixed: false,
        label: entity.name,
        position: [0, 0],
      });

      const anim_group = anim_panel.addGroup({
        label: "Animations",
      });

      for(let i in anim_data) {
        const sub_group = anim_group.addSubGroup({
          label: i,
        }).addButton("PLAY", function() {
          const comp_anim = entity.getComponent("Anim");
          const comp_anim_data = comp_anim.anim.GetData();
          if(!comp_anim_data[i]) {
            comp_anim.state = edit_data[i].name;
          }
          else {
            comp_anim.state = i;
          }
          comp_anim.duration = 0;
        }).addStringInput(edit_data[i], "name");

        const anim_info = anim_data[i];
        const num_frames = anim_info.frames.length;
        for(let i_frame = 0; i_frame < num_frames; ++i_frame) {
          sub_group.addNumberInput(edit_data[i].seconds, i_frame);
        }
      }

      anim_panel.addGroup({
        label: "Management"
      }).addButton("STOP", function() {
        entity.getComponent("Anim").state = "none";
      }).addButton("APPLY", function() {
        const comp_anim_data = entity.getComponent("Anim").anim.GetData();
        for(const i in comp_anim_data) {
          if(!edit_data[i]) {
            continue;
          }

          const seconds = edit_data[i].seconds;
          const frame_info = comp_anim_data[i].frames;
          const num_frames = frame_info.length;

          let total_duration = 0;
          for(let i_frame = 0; i_frame < num_frames; ++i_frame) {
            frame_info[i_frame].start = total_duration;
            total_duration += seconds[i_frame];
            frame_info[i_frame].end = total_duration;
          }
          comp_anim_data[i].total_duration = total_duration;

          if(i == edit_data[i].name) {
            continue;
          }

          comp_anim_data[edit_data[i].name] = comp_anim_data[i];
          delete comp_anim_data[i];
        }
      }).addButton("SAVE", function() {
        const comp_anim = entity.getComponent("Anim");
        const blob = new Blob([JSON.stringify(comp_anim.anim.GetData(), null, " ")], {type: "application/json"});

        const element_save = document.createElement("a");
        element_save.href = URL.createObjectURL(blob);
        element_save.download = entity.name;
        element_save.click();
      });
    }

    function OnOpenJsonFile() {
      const element_load = document.createElement("load");
      element_load.innerHTML = "<input type=\"file\" accept=\".json\">";

      const dialog = element_load.firstChild;
      dialog.addEventListener("change", function() {
        const file = dialog.files[0];
        if (file.name.match(/.json/i)) {
          entity.name = file.name;

          const reader = new FileReader();
          reader.onload = OnLoadAnimationTextFile;
          reader.readAsText(file);
        }
        else {
          alert("File not supported, .json files only");
        }
      });
      dialog.click();
    }

    function OnOpenPngFile() {
      const element_load = document.createElement("load");
      element_load.innerHTML = "<input type=\"file\" accept=\".png\">";

      const dialog = element_load.firstChild;
      dialog.addEventListener("change", function() {
        const file = dialog.files[0];
        if (file.name.match(/.png/i)) {
          entity.removeComponent("Texture");
          entity.addComponent(new ComponentTexture(URL.createObjectURL(file)))
        }
        else {
          alert("File not supported, .png files only");
        }
      });
      dialog.click();
    }

    const main_panel = contolKit.addPanel({
      fixed: false,
      label: "Main",
    });
    main_panel.addButton("OPEN", OnOpenJsonFile, { label: "json File" });
    main_panel.addButton("LOAD", OnOpenPngFile, { label: "png File" });

    return this;
  }

  Update() {
    super.Update();

    this.controlKit_.update();
  }
}
