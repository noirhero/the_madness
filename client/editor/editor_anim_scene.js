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
      const element_div = document.createElement("div");
      element_div.innerHTML = "<input type=\"file\">";

      const dialog = element_div.firstChild;
      dialog.addEventListener("change", function() {
        const file = dialog.files[0];
        if (file.name.match(/.json/i)) {
          const reader = new FileReader();
          reader.onload = function() {
            console.log(reader.result);
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
