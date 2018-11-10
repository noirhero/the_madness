// Copyright 2018 TAP, Inc. All Rights Reserved.

function Main() {
  "use strict";

  let audio_context = null;
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;

    audio_context = new AudioContext;
  }
  catch(err) {
    console.log("No web audio support in this browser.\\n" + err);
    return;
  }

  const socket = new WebSocket("ws:\\localhost:8989");
  socket.onopen = function(event) {
    console.log("Connect.");

    let recorder = null;
    navigator.getUserMedia({
      audio: true,
    }, function(stream) {
      const input = audio_context.createMediaStreamSource(stream);
      recorder = new Recorder(input);
      recorder.record();
      setTimeout(function() {
        recorder.stop();
        recorder.exportWAV(function(blob) {
          socket.send(blob);
        });
      }, 1000);
    }, function(err) {
      consoel.log("No live audio input : ", + err);
    });
  };

  socket.onclose = function(event) {
    console.log("Disconnect.");
  };

  socket.onmessage = function(event) {
    const wav_url = URL.createObjectURL(event.data);
    new Howl({
      src: [wav_url],
      format: ["wav"],
    }).play();
  };
}
