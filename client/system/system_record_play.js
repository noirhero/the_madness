// Copyright 2018 TAP, Inc. All Rights Reserved.

const SystemRecordPlay = CES.System.extend({
  update: function() {
    this.world.getEntities("Websocket").forEach(entity => {
      const websocket_entities = this.world.getEntities("Websocket");
      if(0 === websocket_entities.length) {
        return;
      }

      let madness = 100;
      const player_entites = this.world.getEntities("Player");
      if(0 < player_entites.length) {
        madness = player_entites[0].getComponent("Player").madness;
      }

      const blob_buffer = websocket_entities[0].getComponent("Websocket").blob_buffer;
      let blob_data = blob_buffer.shift();
      while(blob_data) {
        const wav_url = URL.createObjectURL(blob_data);

        if(10 > madness) {
          const voice = new Pizzicato.sound({
            source: "file",
            options: {
              path: [wav_url],
            }
          }, () => {
            voice.addEffect(new Pizzicato.Effects.Distortion({gain: 0.84}));
            voice.play();
          });
        }
        else {
          new Howl({
            src: [wav_url],
            ext: ["wav"],
          }).play();
        }

        blob_data = blob_buffer.shift();
      }
    });
  },
});
