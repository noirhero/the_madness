// Copyright 2018 TAP, Inc. All Rights Reserved.

const ComponentMic = CES.Component.extend({
  name: "Mic",
  init: function() {
    let audio_context = null;
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

      audio_context = new AudioContext();
    }
    catch(err) {
      alert("Create audio context failed : " + err);
      return;
    }

    navigator.getUserMedia({
      audio: true,
    }, stream => {
      this.recoder = new Recorder(audio_context.createMediaStreamSource(stream));
    }, err => {
      alert("No live audio input : " + err);
    });

    this.is_recording = false;
  },
});
