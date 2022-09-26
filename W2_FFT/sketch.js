'use strict';
/**************************************************************************
  P5 Audio FFT Visuallization
  REFERENCES:
  # Michael Simpson's Listening Machines - Fall 2022 - Week 2 collection: https://editor.p5js.org/mgs/collections/ZZLTAa6rT
  # Dan Shiffman’s Coding Train P5.FFT Tutorial: https://youtu.be/2O3nm0Nvbi4
  created 21 Sep 2022
  modified 26 Sep 2022
  by I-Jon Hsieh
 **************************************************************************/

let mic;
let fft;
let lastWave;
let binNum = 256;

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

//visual variables
let scaleVar = 1.5;
let randomVar = 0.4;
let bgBlurVar = 200;

/*
let sliders = {};
let sliderLabels = [];
let sliderConfigs = [
    {
        name: 'scale',
        min: 0.5,
        max: 3,
        initial: 1,
        step: 0.1
    },
    {
        name: 'random',
        min: 0,
        max: 1,
        initial: 0.1,
        step: 0.01
    },
    {
        name: 'blur',
        min: 0,
        max: 360,
        initial: 200,
        step: 1
    }
];
let sliderGap = 25;
*/


let setupSlider = function(configsArray){
    for(let i=0; i< configsArray.length; i++){
        let s = configsArray[i];
        sliderLabels[i] = createP(s.name);
        sliderLabels[i].position(20, i*sliderGap+10);
        sliders[s.name] = createSlider(s.min, s.max, s.initial, s.step);
        sliders[s.name].position(110, i*sliderGap+28);
    }
}


function setup(){
    createCanvas(1600, 800);
    background(0);
    colorMode(HSB,360);



    // setupSlider(sliderConfigs);
    mic = new p5.AudioIn();
    micBtn = createButton('start');
    micBtn.position(15, 12);
    micBtn.mousePressed(buttonToggle);

    fft = new p5.FFT();
    fft.setInput(mic);

    lastWave = fft.waveform(binNum);
    lastWave.length = binNum;


}

function draw(){
    background(0,bgBlurVar);

    let yGap = height/7;
    let lineNum = floor(height/20);
    
    let wave = fft.waveform(binNum);
    wave.length = binNum;


    for(let j = 0; j<lineNum; j++){
        for(let i=0; i<wave.length; i++){
            let x = floor(map(i, 0, wave.length, 0, width));
            let smoothWave = lerp(wave[i], lastWave[i], map(j, 0, lineNum, 0.3, 1));
            let y = map(smoothWave*map(j, 0, lineNum, 0.5, 1)*scaleVar, -1, 1, 0,height);


            y=floor(y-height/2+Math.sqrt(j)*yGap);
            
            noStroke();
            fill(random(200,220),360-j*7,50+Math.sqrt(j)*40);
            circle(x+random(j*randomVar),y,Math.sqrt(j)/2);

            lastWave[i] = smoothWave;
            lastWave.length = binNum;
        }
    }

}
