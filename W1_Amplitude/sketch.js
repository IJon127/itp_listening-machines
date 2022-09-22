'use strict';
/**************************************************************************
  P5 Audio Amplitude Visuallization
  REFERENCES:
  # Michael Simpson's Listening Machines - Fall 2022 - Week 1 collection: https://editor.p5js.org/mgs/collections/TPru2KEqI
  # Dan Shiffman’s Coding Train P5.Sound Tutorial: https://www.youtube.com/playlist?list=PLRqwX-V7Uu6aFcVjlDAkkGIixw70s7jpW
  created 21 Sep 2022
  modified 21 Sep 2022
  by I-Jon Hsieh
 **************************************************************************/


// sound sources
let mic;

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
let sliders = [];
let sliderTitles = [];
let setupSlider = function(index, name, minVar, maxVar, iniVar){
    sliderTitles[index] = createP(name);
    sliders[index] = createSlider(minVar, maxVar, iniVar);
    sliderTitles[index].position(20, index*sliderGap+10);
    sliders[index].position(110, index*sliderGap+28);
}
let sliderGap = 25;

let lastVolume;




function setup(){
    createCanvas(windowWidth, windowHeight);
    background(0);

    setupSlider(0, "smoothing", 0, 10, 5);
    setupSlider(1, "scale", 100, 3000, 2000);
    setupSlider(2, "stroke", 1, 10, 1);
    setupSlider(3, "fade", 0, 100, 50);

    mic = new p5.AudioIn();
    micBtn = createButton('start');
    micBtn.position(15, (sliders.length+1)*sliderGap+15);

    lastVolume = mic.getLevel();

}

function draw(){
    background(0,sliders[3].value());
    micBtn.mousePressed(buttonToggle);

    //get data from the mic can map it to proper level
    let micVolume = lerp(mic.getLevel(), lastVolume, 0.5);
    lastVolume = micVolume;
    let r = map(micVolume, 0,1,0,sliders[1].value());


    //draw circles
    noFill();
    stroke(255);
    strokeWeight(sliders[2].value());
    circle(width/2, height/2, r);

}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    background(0);
}