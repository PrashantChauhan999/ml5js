let video;
let poseNet;
let pose;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  console.log("ml5:", ml5); // Check if ml5 is loaded and contains poseNet
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);
}

function gotPoses(poses) {
  console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
  }
}

function modelLoaded() {
  console.log("Model loaded....");
}

function draw() {
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0);

  if (pose) {
    console.log(pose); // Log the pose object
    if (pose.nose) {
      fill(255, 0, 0);
      ellipse(pose.nose.x, pose.nose.y, 14);
    }
  }
}
