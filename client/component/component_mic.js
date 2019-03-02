// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

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
      this.audio_context = new AudioContext();
      this.input = this.audio_context.createMediaStreamSource(stream);
      this.recorder = new Recorder(this.input, { numChannels: 1 });
    }).catch(function(err) {
      alert("No live audio input : " + err);
    });
  },
});
