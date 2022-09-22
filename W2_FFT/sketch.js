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
        max: 1,
        initial: 0.5,
        step: 0.01
    },
    {
        name: 'random',
        min: 0,
        max: 12,
        initial: 1,
        step: 1
    },
    {
        name: 'blur',
        min: 0,
        max: 100,
        initial: 100,
        step: 1
    }
];
let sliderGap = 25;
// let setupSlider = function(index, name, minVar, maxVar, iniVar, stepVar){
//     sliderLabels[index] = createP(name);
//     sliders[index] = createSlider(minVar, maxVar, iniVar, stepVar);
//     sliderLabels[index].position(20, index*sliderGap+10);
//     sliders[index].position(110, index*sliderGap+28);
// }
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



    setupSlider(sliderConfigs);
    mic = new p5.AudioIn();
    micBtn = createButton('start');
    micBtn.position(15, (sliderConfigs.length+1)*sliderGap+15);
    micBtn.mousePressed(buttonToggle);

    fft = new p5.FFT();
    fft.setInput(mic);
    lastWave = fft.waveform();

}

function draw(){
    background(0,sliders['blur'].value());
    let lineNum = floor(height/15);


    //get FFT waveform
    let wave = fft.waveform();
    for(let j = 0; j<lineNum; j++){
        for(let i=0; i<wave.length; i++){
            let x = map(i, 0, wave.length, 0, width);
            let smoothWave = lerp(wave[i], lastWave[i], map(j, 0, lineNum, 0, 1));
            // let smoothWave = lerp(wave[i], lastWave[i], sliders['smoothing'].value());
            let y = map(smoothWave*map(j, 0, lineNum, 0, 1), -1, 1, 0,height);
            // let y = map(smoothWave*sliders['scale'].value(), -1, 1, 0,height);

            y=y-height/2+j*15;
            fill(255,0,0);
            if (i%10==0){
                circle(x+random(sliders['random'].value()),y,Math.sqrt(j));
            }
            lastWave[i] = smoothWave;
        }
    }



}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    background(0);
}