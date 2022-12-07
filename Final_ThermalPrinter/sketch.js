"use strict";
/**************************************************************************
  Voice Printer
  REFERENCES:
  # Michael Simpson's Listening Machines - Fall 2022 - Week 3 collection: https://editor.p5js.org/mgs/sketches/PbKpTBsub
  created 13 Oct 2022
  modified 15 Oct 2022
  by I-Jon Hsieh & Jinny Kang
 **************************************************************************/

let audioCtx;
let chromaData;
let energyData;

let lastChroma;
let lastRms;

let inp;
let startBtn;
let saveBtn;
let micStarted = false;
let counter = 0;
let again = false;

let myFont;

function setup() {
  let cnv = createCanvas((windowHeight / 11) * 8.5, windowHeight); //letter size ratio
  cnv.position(480, 0);
  background(255);

  inp = select("#superstar");
  startBtn = select("#startBtn");
  startBtn.mousePressed(setupMeyda);

  saveBtn = select("#saveBtn");
  saveBtn.mousePressed(saveResult);
}

function draw() {
  noStroke();
  let x = 1;
  let currHeight = height - counter;

  if (micStarted) {
    if (chromaData && energyData) {
      //draw chroma data
      for (let i = 0; i < chromaData.length - 1; i++) {
        let chromaClr = map(chromaData[i], 0.3, 1, 250, 10);
        let skip = floor(255 / chromaClr);

        for (let p = 0; p < 30; p++) {
          if (p % skip == 0) {
            fill(0);
            rect(i * 30 + p, counter, x, 2);
          }
        }
      }

      if (energyData > 0.3) {
        fill(0);
        rect(x * chromaData.length - 1, counter, 5, 1);
      }

      //draw a white rect
      fill(255);
      rect(0, counter + 1, width, currHeight - 1);
      drawLabels(x, counter + 10);

      //update counter
      counter++;
    }

    //reset
    if (counter > height) {
      micStarted = false;
      displayText();
      startBtn.html("restart");
      startBtn.removeClass("pauseBtn");
      saveBtn.removeClass("hide");
      again = true;
      counter = 0;
    }
  }
}

//meyda-----------------------------------------------------------
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
    startBtn.html("pause");
    startBtn.class("pauseBtn");

    if (again) {
      counter = 0;
      background(255);
      saveBtn.class("hide");
      again = false;
    }

    createMicSrcFrom(audioCtx)
      .then((src) => {
        let analyzer = Meyda.createMeydaAnalyzer({
          audioContext: audioCtx,
          source: src,
          bufferSize: 512,
          featureExtractors: ["chroma", "energy"],
          callback: (features) => {
            if (micStarted) {
              chromaData = features.chroma;
              energyData = features.energy;
            }
          },
        });
        analyzer.start();
      })
      .catch((err) => {
        alert(err);
      });
  } else {
    startBtn.html("resume");
    startBtn.removeClass("pauseBtn");
  }
  micStarted = !micStarted;
}

//result---------------------------------
function displayText() {
  let superstar = inp.value();
  if (!superstar) {
    superstar = "Anonymous Superstar";
  }
  let referX = (width / 40) * 39;
  let referY = height - 50;
  let fsize = 12;
  let lineHeight = fsize * 1.5;
  let currTime = `${month()}/${day()}/${year()} ${hour()}:${minute()}:${second()}`;
  fill(0);
  textFont("monospace", fsize);
  textAlign(RIGHT);

  text(superstar, referX, referY);
  text(currTime, referX, referY + lineHeight);
  text("You sound so beautiful!", referX, referY + lineHeight * 2);
}

function drawLabels(x, y) {
  let pitchClasses = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  textFont("monospace", 10);
  textAlign(LEFT);
  fill(0);
  for (let i = 0; i < pitchClasses.length; i++) {
    text(pitchClasses[i], x * i, y);
  }
  text("rms", x * 12 + 5, y);
}

function saveResult() {
  let superstar = inp.value();
  saveCanvas("voiceprinter_" + superstar, "png");
}
