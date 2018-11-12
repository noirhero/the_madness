// Copyright 2018 TAP, Inc. All Rights Reserved.

class EditorAnimScene extends Scene {
  constructor() {
    super();

    this.controlKit_ = new ControlKit();
  }

  Initialize() {
    this.controlKit_.addPanel({
      fixed: false,
      label: "Main",
    }).addButton("OPEN", function() {
      const element_div = document.createElement("load");
      element_div.innerHTML = "<input type=\"file\">";

      const dialog = element_div.firstChild;
      dialog.addEventListener("change", function() {
        const file = dialog.files[0];
        if (file.name.match(/.json/i)) {
          const reader = new FileReader();
          reader.onload = function() {
            console.log(reader.result);

            const save_data = {
              a: "a",
              b: "b",
            };
            const data = JSON.stringify(save_data, null, " ");
            const blob = new Blob([data], {type: "application/json"});
            const element_save = document.createElement("a");
            element_save.href = URL.createObjectURL(blob);
            element_save.download = "save.json";
            element_save.click();
          };
          reader.readAsText(file);
        }
        else {
          alert("File not supported, .json files only");
        }
      });
      dialog.click();
    }, {
      label: "json File"
    });

    return this;
  }

  Update() {
    super.Update();
    this.controlKit_.update();
  }
}
