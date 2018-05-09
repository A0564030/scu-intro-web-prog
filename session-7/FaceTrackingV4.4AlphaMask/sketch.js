// https://github.com/kylemcdonald/AppropriatingNewTechnologies/wiki/Week-2
//shiffman:https://p5js.org/examples/color-brightness.html
p5.disableFriendlyErrors = true;

var canvas
var cap;
var tracker;
//var img;
var ramp = 0.1;
var w = 720, h = 450;

function setup() {
  canvas = createCanvas(w, h);
  pixelDensity(1);
  cap = createCapture(VIDEO);
  cap.size(w, h);
  cap.hide();
  loadPixels(); // load here as only need update in draw
  
  colorMode(HSB);
  
  tracker = new clm.tracker({searchWindow : 13, scoreThreshold : 0.3});
  tracker.init(pModel);
  tracker.setResponseMode("cycle", "lbp");
  tracker.start(cap.elt);
  noStroke();

}

function draw() {
  background(10);
  cap.loadPixels();
  //loadPixels(); //BLOCK this out for bizarre trailing effect
  var positions = tracker.getCurrentPosition();
  if(positions.length > 0) {  
    //image(cap, 0, 0, w, h); // draw the camera image
      for (var x = 0; x < cap.width; x++) {
        for (var y = 0; y < cap.height; y++ ) {
          // Calculate the 1D location from a 2D grid
          var loc = (x + y*cap.width)*4;
          // Get the R,G,B values from image
          // Calculate an amount to change brightness based on proximity to the mouse
          var maxdist = 2;
          var d = distSquared(x, y, positions[47][0], positions[47][1]+5); // set squared distance (e.g. 10000 for 100) faster performance
          var center = Math.sqrt(d); // get center - rgb intensity will diffuse for sometimes interesting results
          var fade = Math.max(0, (maxdist*2 - Math.sqrt(d)*ramp)/maxdist*ramp); // "*2" is to start fade after maxdist; "ramp" generally 1 or less; and d an increasing value
            r = center > maxdist ? ((1-fade)*(pixels[loc])+(fade*cap.pixels[loc])) : (cap.pixels[loc]);
            g = center > maxdist ? ((1-fade)*(pixels[loc+1])+(fade*cap.pixels[loc+1])) : (cap.pixels[loc+1]);
            b = center > maxdist ? ((1-fade)*(pixels[loc+2])+(fade*cap.pixels[loc+2])) : (cap.pixels[loc+2]);    
            a = center > maxdist ? ((1-fade)*(pixels[loc+3])+(fade*cap.pixels[loc+3])) : 5;
          
          // Make a new color and set pixel in the window
          
          pixels[loc] = r;
          pixels[loc+1] = g;
          pixels[loc+2] = b;
          pixels[loc+3] = 255;
      }
    }
  }  
  updatePixels(); // connects with loadpixels();
}

function distSquared(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return dx * dx + dy * dy;
}

