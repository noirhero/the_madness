// Copyright 2018 TAP, Inc. All Rights Reserved.

function Main() {
  "use strict";

  WebGLInitialize();

  const scene_mng = new SceneManager(GetSceneInRegistry("Game", "data/scene/scene_test.json").Initialize());
  scene_mng.Run();

  // URL = window.URL || window.webkitURL;
  // var AudioContext = window.AudioContext || window.webkitAudioContext;
  // var constraints = { audio: true, video:false };
  //
  // var audioContext = null;
  // var input = null;
  // var recorder = null;
  //
  // navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
  //   console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
  //
  //   /*
  //     create an audio context after getUserMedia is called
  //     sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
  //     the sampleRate defaults to the one set in your OS for your playback device
  //   */
  //   audioContext = new AudioContext();
  //
  //   /* use the stream */
  //   input = audioContext.createMediaStreamSource(stream);
  //
  //   /*
  //     Create the Recorder object and configure to record mono sound (1 channel)
  //     Recording 2 channels  will double the file size
  //   */
  //   recorder = new Recorder(input, { numChannels: 1 });
  //
  //   //start the recording process
  //   recorder.record();
  //
  //   console.log("Recording started");
  //
  //   setTimeout(function() {
  //     recorder.stop();
  //     recorder.exportWAV(function(blob) {
  //       const wav_url = URL.createObjectURL(blob);
  //       new Howl({
  //         src: [wav_url],
  //         format: ["wav"],
  //       }).play();
  //     });
  //   }, 3000);
  // }).catch(function(err) {
  //   //enable the record button if getUserMedia() fails
  //   alert("No live audio input : " + err);
  // });

  // let audio_context = null;
  // try {
  //   window.AudioContext = window.AudioContext || window.webkitAudioContext;
  //   navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
  //   URL = window.URL || window.webkitURL;
  //   var AudioContext = window.AudioContext || window.webkitAudioContext;
  //
  //   audio_context = new AudioContext;
  // }
  // catch(err) {
  //   console.log("No web audio support in this browser.\\n" + err);
  //   return;
  // }
  //
  // let recorder = null;
  // navigator.mediaDevices.getUserMedia({
  //   audio: true,
  //   video: false,
  // }).then(function(stream) {
  //   const input = audio_context.createMediaStreamSource(stream);
  //   recorder = new Recorder(input,{numChannels:1});
  //   recorder.record();
  //   setTimeout(function() {
  //     recorder.stop();
  //     recorder.exportWAV(function(blob) {
  //       const wav_url = URL.createObjectURL(blob);
  //       new Howl({
  //         src: [wav_url],
  //         format: ["wav"],
  //       }).play();
  //     });
  //   }, 3000);
  // }).catch(function(err) {
  //   alert("No live audio input : " + err);
  // });
}
