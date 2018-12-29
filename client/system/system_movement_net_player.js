// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemMovementNetPlayer = CES.System.extend({
  update: function() {
    const websocket_entities = this.world.getEntities("Websocket");
    if(0 === websocket_entities.length) {
      return;
    }

    const sync_buffer = websocket_entities[0].getComponent("Websocket").sync_buffer;
    let sync_data = sync_buffer.shift();
    while(sync_data) {
      this.world.getEntities();

      sync_data = sync_buffer.shift();
    }
  },
});
