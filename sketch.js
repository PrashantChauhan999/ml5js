let video;
let bodyPose;
let poses = [];
let connections;

let boundaryBox;

function preload() {
  // Load the bodyPose model
  bodyPose = ml5.bodyPose();
}

function setup() {
  createCanvas(640, 480);

  // Create the video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Start detecting poses in the webcam video
  bodyPose.detectStart(video, gotPoses);
  // Get the skeleton connection information
  connections = bodyPose.getSkeleton();

  // Define the boundary box dynamically based on device dimensions
  boundaryBox = {
    x: 100,
    y: 50,
    width: width - 200,
    height: height - 100
  };
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  // Draw the boundary box
  noFill();
  stroke(0, 0, 255);
  strokeWeight(2);
  rect(boundaryBox.x, boundaryBox.y, boundaryBox.width, boundaryBox.height);

  // Draw the skeleton connections if all keypoints are inside the boundary box
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    if (areAllKeypointsInsideBoundary(pose.keypoints, boundaryBox)) {
      for (let j = 0; j < connections.length; j++) {
        let pointAIndex = connections[j][0];
        let pointBIndex = connections[j][1];
        let pointA = pose.keypoints[pointAIndex];
        let pointB = pose.keypoints[pointBIndex];
        // Only draw a line if both points are confident enough
        if (pointA.score > 0.1 && pointB.score > 0.1) {
          stroke(255, 0, 0);
          strokeWeight(2);
          line(pointA.x, pointA.y, pointB.x, pointB.y);
        }
      }

      // Draw all the tracked landmark points
      for (let j = 0; j < pose.keypoints.length; j++) {
        let keypoint = pose.keypoints[j];
        // Only draw a circle if the keypoint's confidence is bigger than 0.1
        if (keypoint.score > 0.1) {
          fill(0, 255, 0);
          noStroke();
          circle(keypoint.x, keypoint.y, 10);
        }
      }
    }
  }
}

// Callback function for when bodyPose outputs data
function gotPoses(results) {
  // Save the output to the poses variable
  poses = results;
}

// Check if all keypoints are inside the boundary box
function areAllKeypointsInsideBoundary(keypoints, boundary) {
  for (let i = 0; i < keypoints.length; i++) {
    let keypoint = keypoints[i];
    if (keypoint.x < boundary.x || keypoint.x > boundary.x + boundary.width ||
        keypoint.y < boundary.y || keypoint.y > boundary.y + boundary.height) {
      return false;
    }
  }
  return true;
}
