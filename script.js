/*
	GRADIENT INTERFERENCE
	CSS3 repeating-linear-gradient() experiment.

	Author:   Antonio Belluscio
	Creation: 2015
	Version:  2017
	License:  MIT License
*/


// CORE VARIABLES AND CLASSES

var rearColors;
var frontColors;

var rearPercs;
var frontPercs;

function ColorStop( baseHue )
{
	this.h = ((Math.random()*180+270) + baseHue) % 360;
	this.s = Math.random()*100;
	this.l = Math.random()*100;
}

function PercStop( minVal, maxVal )
{
  	this.minVal = minVal;
  	this.maxVal = maxVal;
    this.val = Math.random()*(this.maxVal-this.minVal)+this.minVal;
    this.velVal = Math.random()*(this.maxVal*0.0005)+0.0001;
  	if (Math.random()<0.5) {
      	this.velVal = -this.velVal;
    }
    this.update = function() {
    	this.val += this.velVal;
      	if (this.val>this.maxVal || this.val<this.minVal) {
        	this.velVal = -this.velVal;
	    	this.val += this.velVal;
      	}
    };
}


// INTERFACE VARIABLES

var browser_webkit = /webkit/.test(navigator.userAgent.toLowerCase());
var browser_msie = /trident/.test(navigator.userAgent.toLowerCase());
var browser_mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !browser_webkit && !browser_msie;
var browser_opera = /opera/.test(navigator.userAgent.toLowerCase());
var browser_touch = ('ontouchstart' in window);

var gradientsDiv;
var rearGradientDiv;
var frontGradientDiv;
var controlsDiv;
var regenerateBtn;
var separateBtn;
var separateCaption;
var separateDownCaption;
var controlsMouseOver = false;
var buttonsWaiting;
var gradientPrefix;


// CORE FUNCTIONS

window.addEventListener("load", setupWork, false );

function setupWork()
{
	initInterface();

	gradientPrefix = "repeating-linear-gradient(to right, ";
	rearGradientDiv.style.backgroundImage = gradientPrefix+"#000, #000 0%, #000 1%)";
	if (rearGradientDiv.style.backgroundImage.indexOf("gradient") === -1) {
		if (browser_webkit) {
			gradientPrefix = "-webkit-repeating-linear-gradient(right, ";
		} else if (browser_opera) {
			gradientPrefix = "-o-repeating-linear-gradient(right, ";
		} else if (browser_mozilla) {
			gradientPrefix = "-moz-repeating-linear-gradient(right, ";
		}
	}
	console.log(gradientPrefix);

	regenerate();

  	requestAnimationFrame(update);
}

function update()
{
  	for (var i=0; i<rearPercs.length; ++i) {
    	rearPercs[i].update();
		frontPercs[i].update();
  	}

  	var currPerc = 50 - (rearPercs[0].val + rearPercs[1].val + rearPercs[2].val + rearPercs[3].val) / 2;
	var rearHSL = new Array(4);
	for (var i=0; i<4; ++i) {
		currPerc += rearPercs[i].val;
		var j = i % 3;
		rearHSL[i] = "hsl("+rearColors[j].h+","+rearColors[j].s+"%,"+rearColors[j].l+"%) "+currPerc+"%";
	}

  	currPerc = 50 - (frontPercs[0].val+frontPercs[1].val+frontPercs[2].val+frontPercs[3].val)/2;
  	var frontHSL = new Array(4);
  	for (var i=0; i<4; ++i) {
	  	currPerc += frontPercs[i].val;
	  	var j = i % 3;
	  	frontHSL[i] = "hsla("+frontColors[j].h+","+frontColors[j].s+"%,"+frontColors[j].l+"%,0.5) "+currPerc+"%";
  	}

    rearGradientDiv.style.backgroundImage = gradientPrefix + rearHSL[0] +", "+ rearHSL[1] +", "+ rearHSL[2] +", "+ rearHSL[3] +")";
	frontGradientDiv.style.backgroundImage = gradientPrefix + frontHSL[0] +", "+ frontHSL[1] +", "+ frontHSL[2] +", "+ frontHSL[3] +")";

	updateInterface();
  	requestAnimationFrame(update);
}

function regenerate()
{
	var baseHue = Math.random()*360;
	rearColors = [new ColorStop(baseHue), new ColorStop(baseHue), new ColorStop(baseHue)];
	baseHue = Math.random()*360;
	frontColors = [new ColorStop(baseHue), new ColorStop(baseHue), new ColorStop(baseHue)];

	rearPercs = [new PercStop(0.1,10), new PercStop(0.1,10), new PercStop(0.1,10), new PercStop(0.1,10)];
	frontPercs = [new PercStop(0.1,5), new PercStop(0.1,5), new PercStop(0.1,5), new PercStop(0.1,5)];
}


// INTERFACE FUNCTIONS

function initInterface()
{
	gradientsDiv =  document.getElementById("gradients");
    rearGradientDiv = document.getElementById("rear-gradient");
    frontGradientDiv = document.getElementById("front-gradient");
    controlsDiv = document.getElementById("controls");
    regenerateBtn = document.getElementById("regenerate");
    separateBtn = document.getElementById("separate");
	separateCaption = separateBtn.innerHTML;
	separateDownCaption = separateBtn.getAttribute('data-down');

    if (browser_touch) {
      gradientsDiv.addEventListener( "touchend", canvasTouchEnded, false );
      regenerateBtn.addEventListener( 'touchend',  regenerateAction, false);
      separateBtn.addEventListener( 'touchend',  separateAction, false);
    } else {
      gradientsDiv.onmousemove = canvasMouseMoved;
      regenerateBtn.addEventListener( 'click',  regenerateAction, false);
      separateBtn.addEventListener( 'click',  separateAction, false);
      controlsDiv.addEventListener('mouseover', function() {
        controlsMouseOver = true;
      }, false);
      controlsDiv.addEventListener('mouseout', function() {
        controlsMouseOver = false;
      }, false);
    }

    buttonsWaiting = 30000;
}

function updateInterface()
{
	if (buttonsWaiting > 0) {
      controlsDiv.style.display = 'block';
      if (!controlsMouseOver) {
        buttonsWaiting -= 33;
      }
    } else {
      controlsDiv.style.display = 'none';
    }
}

function canvasMouseMoved( evt )
{
    buttonsWaiting = 500;
}

function canvasTouchEnded(evt)
{
    if (buttonsWaiting > 0) {
        buttonsWaiting = 0;
    } else {
        buttonsWaiting = 60000;
    }
}

function regenerateAction()
{
  	regenerate();

  	if (browser_touch) {
		buttonsWaiting = 60000;
	}
}

function separateAction()
{
  	gradientsDiv.classList.toggle("separate");
  	if (separateBtn.innerHTML == separateCaption) {
	  	separateBtn.innerHTML = separateDownCaption;
  	} else {
	  	separateBtn.innerHTML = separateCaption;
  	}

  	if (browser_touch) {
		buttonsWaiting = 60000;
	}
}
