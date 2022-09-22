'use strict';
/**************************************************************************
  P5 Audio FFT Visuallization
  REFERENCES:
  # Michael Simpson's Listening Machines - Fall 2022 - Week 2 collection: https://editor.p5js.org/mgs/collections/ZZLTAa6rT
  # Dan Shiffman’s Coding Train P5.FFT Tutorial: https://youtu.be/2O3nm0Nvbi4
  created 21 Sep 2022
  modified 22 Sep 2022
  by I-Jon Hsieh
 **************************************************************************/

let mic;
let fft;
let lastWave;
let binNum;

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
// let sliders = [];
let sliderLabels = [];
let sliderConfigs = [
    // {
    //     name: 'smoothing',
    //     min: 0,
    //     max: 1,
    //     initial: 0.5,
    //     step: 0.01
    // },
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
    },
    {
        name: 'density',
        min: 6,
        max: 9,
        initial: 9,
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







function setup(){
    createCanvas(windowWidth, windowHeight);
    background(0);
    colorMode(HSB,360);



    setupSlider(sliderConfigs);
    mic = new p5.AudioIn();
    micBtn = createButton('start');
    micBtn.position(15, (sliderConfigs.length+1)*sliderGap+15);
    micBtn.mousePressed(buttonToggle);

    fft = new p5.FFT();
    fft.setInput(mic);

    binNum = Math.pow(2,sliders['density'].value());
    lastWave = fft.waveform(binNum);
    console.log(lastWave.length);
    lastWave.length = binNum;
    console.log(lastWave.length);


}

function draw(){
    background(0,sliders['blur'].value());

    let yGap = height/7;
    let lineNum = floor(height/20);
    


    //get FFT waveform
    binNum = Math.pow(2,sliders['density'].value());
    let wave = fft.waveform(binNum);
    
    wave.length = binNum;


    for(let j = 0; j<lineNum; j++){
        for(let i=0; i<binNum; i++){
            let x = map(i, 0, binNum, 0, width);
            let smoothWave = lerp(wave[i], lastWave[i], map(j, 0, lineNum, 0.3, 1));
            // let smoothWave = lerp(wave[i], lastWave[i], sliders['smoothing'].value());
            let y = map(smoothWave*map(j, 0, lineNum, 0.5, 1)*sliders['scale'].value(), -1, 1, 0,height);


            y=y-height/2+Math.sqrt(j)*yGap;
            
            noStroke();

            fill(random(200,220),360-j*7,50+Math.sqrt(j)*40);

            circle(x+random(j*sliders['random'].value()),y,Math.sqrt(j)/2);

            lastWave[i] = smoothWave;
            lastWave.length = binNum;
        }
    }



}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    background(0);
}