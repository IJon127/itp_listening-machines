"use strict";
/**************************************************************************
  P5 Audio FFT Visuallization
  REFERENCES:
  # Michael Simpson's Listening Machines - Fall 2022 - Week 2 collection: https://editor.p5js.org/mgs/collections/ZZLTAa6rT
  # Dan Shiffman’s Coding Train P5.FFT Tutorial: https://youtu.be/2O3nm0Nvbi4
  created 21 Sep 2022
  modified 26 Sep 2022
  by I-Jon Hsieh
 **************************************************************************/

let audioCtx;
let chromaData;

let micBtn;
let micStarted = false;
let counter = 0;

function createMicSrcFrom(audioCtx) {
  return new Promise((resolve, reject) => {
    /* only audio */
    let constraints = { audio: true, video: false };

    /* get microphone access */
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        /* create source from microphone input stream */
        let src = audioCtx.createMediaStreamSource(stream);
        resolve(src);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function setupMeyda() {
  audioCtx = getAudioContext();

  if (!micStarted) {
    audioCtx.resume();
    micBtn.html("pause");

    createMicSrcFrom(audioCtx)
      .then((src) => {
        let analyzer = Meyda.createMeydaAnalyzer({
          audioContext: audioCtx,
          source: src,
          bufferSize: 512,
          featureExtractors: ["chroma"],
          callback: (features) => {
            if (micStarted) {
              chromaData = features.chroma;
            }
          },
        });
        analyzer.start();
      })
      .catch((err) => {
        alert(err);
      });
  } else {
    micBtn.html("start");
  }
  micStarted = !micStarted;
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  micBtn = createButton("start");
  micBtn.position(15, 15);
  micBtn.mousePressed(setupMeyda);
}

function draw() {
  //background(50);
  noStroke();
  let x = width / 12;

  if (micStarted) {
    counter++;
    if (chromaData) {
      for (let i = 0; i < chromaData.length; i++) {
        let clr = map(chromaData[i], 0, 1, 0, 255);
        fill(clr);
        rect(i * x, 0, x, height - counter);
      }
    }
  }
}
