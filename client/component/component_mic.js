// Copyright 2018 TAP, Inc. All Rights Reserved.

URL = window.URL || window.webkitURL;
const AudioContext = window.AudioContext || window.webkitAudioContext;

const ComponentMic = CES.Component.extend({
  name: "Mic",
  init: function() {
    this.is_recording = false;
    this.audio_context = null;
    this.input = null;
    this.recorder = null;

    navigator.mediaDevices.getUserMedia({
      audio: true,
      video:false
    }).then(stream => {
      console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

      /*
        create an audio context after getUserMedia is called
        sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
        the sampleRate defaults to the one set in your OS for your playback device
      */
      this.audio_context = new AudioContext();

      /* use the stream */
      this.input = this.audio_context.createMediaStreamSource(stream);

      /*
        Create the Recorder object and configure to record mono sound (1 channel)
        Recording 2 channels  will double the file size
      */
      this.recorder = new Recorder(this.input, { numChannels: 1 });

      // //start the recording process
      // recorder.record();
      //
      // console.log("Recording started");
      //
      // setTimeout(function() {
      //   recorder.stop();
      //   recorder.exportWAV(function(blob) {
      //     const wav_url = URL.createObjectURL(blob);
      //     new Howl({
      //       src: [wav_url],
      //       format: ["wav"],
      //     }).play();
      //   });
      // }, 3000);
    }).catch(function(err) {
      alert("No live audio input : " + err);
    });
  },
});
