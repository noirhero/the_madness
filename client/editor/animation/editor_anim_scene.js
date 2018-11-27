// Copyright 2018 TAP, Inc. All Rights Reserved.

class EditorAnimScene extends Scene {
  constructor() {
    super();

    this.world_.addSystem(new SystemViewport);

    this.entity_ = new CES.Entity();
    this.entity_.addComponent(new ComponentViewport());
    this.world_.addEntity(this.entity_);

    this.controlKit_ = new ControlKit();
  }

  Initialize() {
    let entity = this.entity_;
    let contolKit = this.controlKit_;

    contolKit.addPanel({
      fixed: false,
      label: "Main",
    }).addButton("OPEN", function() {
      const element_load = document.createElement("load");
      element_load.innerHTML = "<input type=\"file\" accept=\".json\">";

      const dialog = element_load.firstChild;
      dialog.addEventListener("change", function() {
        const file = dialog.files[0];
        if (file.name.match(/.json/i)) {
          const reader = new FileReader();
          reader.onload = function() {
            const anim_data = AnimationParse(reader.result);
            const anim_blob = new Blob([JSON.stringify(anim_data, null, " ")], {type: "application/json"});
            const anim_url = URL.createObjectURL(anim_blob);

            entity.removeComponent("Anim");
            entity.addComponent(new ComponentAnim(anim_url));

            const panel = contolKit.addPanel({
              fixed: false,
              label: file.name,
              position: [0, 0],
            });

            const group_anims = panel.addGroup({
              label: "Animations",
            });

            const temp_anim_data = {}
            for(let i in anim_data) {
              temp_anim_data[i] = {
                name: i,
                frames: {},
              };

              const anim_info = anim_data[i];
              const num_frames = anim_info.frames.length;
              for(let i_frame = 0; i_frame < num_frames; ++i_frame) {
                const frame_info = anim_info.frames[i_frame];
                temp_anim_data[i].frames[i_frame] = frame_info.end - frame_info.start;
              }

              const sub_group = group_anims.addSubGroup({
                label: i,
              }).addButton("PLAY", function() {
                const comp_anim = entity.getComponent("Anim");
                const comp_anim_data = comp_anim.anim.GetData();
                if(!comp_anim_data[i]) {
                  comp_anim.state = temp_anim_data[i].name;
                }
                else {
                  comp_anim.state = i;
                }
                comp_anim.duration = 0;
              }).addStringInput(temp_anim_data[i], "name");

              for(let i_frame = 0; i_frame < num_frames; ++i_frame) {
                sub_group.addNumberInput(temp_anim_data[i].frames, i_frame);
              }
            }

            panel.addGroup({
              label: "Management"
            }).addButton("STOP", function() {

            }).addButton("APPLY", function() {
              const comp_anim_data = entity.getComponent("Anim").anim.GetData();
              for(const i in comp_anim_data) {
                if(!temp_anim_data[i]) {
                  continue;
                }

                let total_duration = 0;
                const dest_frames = temp_anim_data[i].frames;
                const src_frames = comp_anim_data[i].frames;
                const num_src_frames = src_frames.length;
                for(let i_frame = 0; i_frame < num_src_frames; ++i_frame) {
                  src_frames[i_frame].start = total_duration;
                  total_duration += dest_frames[i_frame];
                  src_frames[i_frame].end = total_duration;
                }
                comp_anim_data[i].total_duration = total_duration;

                if(i == temp_anim_data[i].name) {
                  continue;
                }

                comp_anim_data[temp_anim_data[i].name] = comp_anim_data[i];
                delete comp_anim_data[i];
              }
            }).addButton("SAVE", function() {
              const comp_anim = entity.getComponent("Anim");
              const blob = new Blob([JSON.stringify(comp_anim.anim.GetData(), null, " ")], {type: "application/json"});

              const element_save = document.createElement("a");
              element_save.href = URL.createObjectURL(blob);
              element_save.download = file.name;
              element_save.click();
            });
          };

          reader.readAsText(file);
        }
        else {
          alert("File not supported, .json files only");
        }
      });
      dialog.click();
    }, {
      label: "json File",
    }).addButton("LOAD", function() {
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
    }, {
      label: "png File",
    });

    return this;
  }

  Update() {
    super.Update();

    this.controlKit_.update();
  }
}
