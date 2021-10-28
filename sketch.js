let day;
let hour;
const eye = document.querySelector(".eye");
const grid = document.querySelector(".grid");
let myp5one;
let myp5two;

/////eye/////
var t = function (p) {
  let video;
  let videoo;
  let poseNet;
  let eye1X;
  let eye1Y;
  let eye2X;
  let eye2Y;
  let h;
  let backColor = 255;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);

    h = p.hour();

    if (h <= 17 && h > 7) {
      backColor = 255;
    } else if ((h <= 20 && h > 17) || (h <= 7 && h > 4)) {
      backColor = 100;
    } else if ((h <= 24 && h > 20) || (h <= 4 && h > 0)) {
      backColor = 0;
      eye.style.color = "white";
      grid.style.color = "white";
    }


    p.background(backColor, backColor, backColor);

    video = p.createCapture(p.VIDEO);
    videoo = p.createCapture(p.VIDEO);
    video.size(p.width, p.height);
    videoo.size(100, 100);

    video.hide();
    videoo.hide();

    poseNet = ml5.poseNet(video);
    poseNet.on("pose", p.gotPoses);
  };

  p.draw = function () {
    p.translate(p.width, 0);
    p.scale(-1, 1);
    p.image(videoo, 0, 0);

    p.fill(255, 0, 0);
    p.noStroke();
    p.ellipse(eye1X, eye1Y, 20);
    p.ellipse(eye2X, eye2Y, 20);
  };

  p.gotPoses = function (poses) {
    if (poses.length > 0) {
      eye1X = poses[0].pose.keypoints[1].position.x;
      eye1Y = poses[0].pose.keypoints[1].position.y;

      eye2X = poses[0].pose.keypoints[2].position.x;
      eye2Y = poses[0].pose.keypoints[2].position.y;
    }
  };

  p.reset = function () {
    p.clear();
  };
};

myp5one = new p5(t, "eyeC");

/////grid/////
var tt = function (p) {
  let video;
  let videoo;
  let backColor = 255;
  let h;
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);

    h = p.hour();

    if (h <= 17 && h > 7) {
      backColor = 255;
    } else if (h <= 20 && h > 17) {
      backColor = 100;
    } else if ((h <= 24 && h > 20) || (h <= 7 && h >= 0)) {
      backColor = 0;
      eye.style.color = "white";
      grid.style.color = "white";
    }

    video = p.createCapture(p.VIDEO);
    videoo = p.createCapture(p.VIDEO);
    video.size(p.width, p.height);
    videoo.size(100, 100);

    video.hide();
    videoo.hide();
  };

  p.draw = function () {
    p.background(backColor, backColor, backColor);
    p.translate(p.width, 0);
    p.scale(-1, 1);
    p.image(videoo, 0, 0);

    let gridSize = 100;
    p.translate(p.width, 0);
    p.scale(-1, 1);
    video.loadPixels();
    for (let y = 0; y < video.height; y += gridSize) {
      for (let x = 0; x < video.width; x += gridSize) {
        let index = (y * video.width + x) * 4;
        let r = video.pixels[index];
        let dia = p.map(r, 0, 255, gridSize, 2);

        p.fill(0, 0, 255);
        p.noStroke();
        p.circle(x, y, dia - 30);
      }
    }
  };
};

/////switch between two canvases/////
eye.addEventListener("click", function (e) {
  grid.style.display = "block";
  eye.style.display = "none";
  myp5two.remove();
  myp5one = new p5(t, "eyeC");
});
grid.addEventListener("click", function (e) {
  grid.style.display = "none";
  eye.style.display = "block";
  myp5one.reset();
  myp5one.remove();
  myp5two = new p5(tt, "gridC");
});

/////References/////
//Tutorial on face tracking using ml5.js
// https://www.youtube.com/watch?v=EA3-k9mnLHs

//Tutorial on converting webcam pixels to p5.js geometries
// https://www.youtube.com/watch?v=VYg-YdGpW1o

//Tutorial on using multiple p5.js canvas
// http://joemckaystudio.com/multisketches/
