// 'use strict';
/**************************************************************************
  P5 Audio FFT Visuallization
  REFERENCES:
  # Michael Simpson's Listening Machines - Fall 2022 - Week 2 collection: https://editor.p5js.org/mgs/collections/ZZLTAa6rT
  # Dan Shiffman’s Coding Train P5.FFT Tutorial: https://youtu.be/2O3nm0Nvbi4
  created 21 Sep 2022
  modified 21 Sep 2022
  by I-Jon Hsieh
 **************************************************************************/

let mic;
let fft;
let lastWaveform;

// controlling UI
let micBtn;
let micStarted = false;
let buttonToggle = function() {
    console.log("btn pressed");
    if(!micStarted){
        mic.start();
        micBtn.html('pause');
        micStarted = true;
    } else {
        mic.stop();
        micBtn.html('start');
        micStarted = false;
    }   
};

let sliders = {};
let sliderLabels = [];
let sliderConfigs = [
    {
        name: 'smoothing',
        min: 0,
        max: 1,
        initial: 0.5,
        step: 0.01
    },
    {
        name: 'scale',
        min: 0,
        max: 500,
        initial: 100,
        step: 1
    },
    {
        name: 'random',
        min: 0,
        max: 3,
        initial: 1,
        step: 1
    },
    {
        name: 'blur',
        min: 0,
        max: 100,
        initial: 50,
        step: 1
    }
];
let sliderGap = 25;
let setupSlider = function(configsArray){
    for(let i=0; i< configsArray.length; i++){
        let s = configsArray[i];
        sliderLabels[i] = createP(s.name);
        sliderLabels[i].position(20, i*sliderGap+10);
        sliders[s.name] = createSlider(s.min, s.max, s.initial, s.step);
        sliders[s.name].position(110, i*sliderGap+28);
    }
}


//set colors
let bgColor = '#000000';




function setup(){
    createCanvas(windowWidth, windowHeight);
    background(bgColor);


    setupSlider(sliderConfigs);
    mic = new p5.AudioIn();
    micBtn = createButton('start');
    micBtn.position(15, (sliderConfigs.length+1)*sliderGap+15);
    micBtn.mousePressed(buttonToggle);

    fft = new p5.FFT();
    fft.setInput(mic);

    lastWaveform = fft.waveform();
    console.log(sliders['scale'].value())

}

function draw(){
    background(bgColor);


    //get FFT waveform
    let wave = fft.waveform();

    for(let i=0; i<wave.length; i++){
        let x = map(i, 0, wave.length, 0, width);
        let y = map(wave[i], -1, 1, 0,height);
        fill(255,0,0);
        circle(x,y,2);
    }


}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    background(bgColor);
}