// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  `attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`;

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

// Globals related to UI Elements
let g_globalAngleX = 0;
let g_globalAngleY = 0;
let g_globalAngleZ = 0;

// Performance + Animation Globals
var g_start_time = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_start_time
var g_joint1 = 0; // Head Joint
var g_joint2 = 0; // Root Joint (torso)
var g_joint3 = 0; // Left Foot Joint
var g_joint4 = 0; // Right Foot Joint
var g_joint5 = 0; // Left Arm Joint
var g_joint6 = 0; // Right Arm Joint


var g_Waddle_Animation = false;
var g_Hat_Animation = false;
var g_waddleSpeed = 0.02;

 //Colors
//var body_color = [0, 0, 0, 1];
//var belly_color = [1, 1, 1, 1];
//var beak_color = [1, 0.5, 0, 1];
//var feet_color = [1, 0.5, 0, 1];


function main() {
    setupWebGL();
    connectVariablesToGLSL();
    addActionsForHtmlUI();
    gl.clearColor(0.6, 0.8, 1.0, 1.0);
    requestAnimationFrame(tick);
}

function tick(){
    g_seconds = performance.now()/1000.0 - g_start_time;
    updateAnimationAngles();
    // Draw everything
    renderAllShapes();
    requestAnimationFrame(tick);
  }

// Helper Functions
function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');
    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
      }
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL); // Ensures closer objects appear in front
    gl.disable(gl.BLEND); // Disable blending to avoid unwanted transparency
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
      console.log('Failed to get the storage location of u_ModelMatrix');
      return;
  }
  // Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
      console.log('Failed to get the storage location of u_GlobalRotateMatrix');
      return;
  }
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Update the angles of everything if currently animated
function updateAnimationAngles() {
    if (g_Waddle_Animation) {
      g_Joint1 = 10 * Math.sin(g_seconds * 3);
      g_Joint2 = -10 * Math.sin(g_seconds * 3);
    }
  }

// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
    // Check the time at the start of this function
    var startTime = performance.now();
    // Pass the matrix to u_ModelMatrix attribute
    var globalRotMat = new Matrix4().rotate(g_globalAngleX,1,0,0);
    globalRotMat.rotate(g_globalAngleY,0,1,0);
    globalRotMat.rotate(g_globalAngleZ,0,0,1);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT );
    // Draw the blocky animal
    drawPenguin();
    // Check the time at the end of the function, and show on web page
    var duration = performance.now() - startTime;
    sendTextToHTML( " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration) / 10, "fps");}

// Set the text of a HTML element
function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if(!htmlElm) {
      console.log('Failed to get the HTML element with the specified ID');
      return;
    }
    htmlElm.innerHTML = text;
}

// set up actions for the HTML UI elements
function addActionsForHtmlUI() {

// Button Events
document.getElementById("animationJoint1OnButton").onclick = function() {
    g_waddleAnimation = true;
    renderScene();
};
document.getElementById("animationJoint1OffButton").onclick = function() {
    g_waddleAnimation = false;
};
document.getElementById('HatAnimationButton_On').onclick = function(){g_Hat_Animation = true}
document.getElementById('HatAnimationButton_Off').onclick = function(){g_Hat_Animation = false}

// X Y Z Camera Position
document.getElementById('X').addEventListener(('mousemove'),function (){g_globalAngleX = this.value;renderAllShapes();})
document.getElementById('Y').addEventListener(('mousemove'),function (){g_globalAngleY = this.value;renderAllShapes();})
document.getElementById('Z').addEventListener(('mousemove'),function (){g_globalAngleZ = this.value;renderAllShapes();})

// Render
document.getElementById("joint1").oninput = function() { g_joint1 = this.value; renderScene(); };
document.getElementById("joint2").oninput = function() { g_joint2 = this.value; renderScene(); };
document.getElementById("joint3").oninput = function() { g_joint3 = this.value; renderScene(); };
document.getElementById("joint4").oninput = function() { g_joint4 = this.value; renderScene(); };
document.getElementById("joint5").oninput = function() { g_joint5 = this.value; renderScene(); };
document.getElementById("joint6").oninput = function() { g_joint6 = this.value; renderScene(); };

// Call function to set default values
setInitialJointValues();
}

function setInitialJointValues() {
  let joint5 = document.getElementById("joint5");
  let joint6 = document.getElementById("joint6");
  let cameraY = document.getElementById("Y");

  if (joint5 && joint6 && cameraY) {
      joint5.value = 180;
      joint6.value = 180;
      cameraY.value = 180;

      g_joint5 = 180;
      g_joint6 = 180;
      g_globalAngleY = 180;

      renderAllShapes();
  } else {
      console.error("One or more elements were not found in the DOM.");
  }
}


function renderScene() {
    if (g_waddleAnimation) {
        g_joint3 = 10 * Math.sin(performance.now() * g_waddleSpeed);
        g_joint4 = -10 * Math.sin(performance.now() * g_waddleSpeed);
    }
    drawPenguin();
    requestAnimationFrame(renderScene);
}

function drawPenguin() {
  // Body
  var body = new Cube();
  body.color = [1, 1, 1, 1]; // Greyish-white belly
  body.matrix.rotate(g_joint2, 0, 1, 0);
  body.matrix.scale(0.6, 0.85, 0.4);
  body.matrix.translate(-.4, -.66, -.25);
  body.render();
  
  // Head
  var head = new Cube();
  head.color = [0, 0, 0, 1]; // Black head
  head.matrix.translate(-.14, 0.3, -0.1);
  head.matrix.rotate(g_joint1, 0, 1, 0);
  head.matrix.scale(0.4, 0.4, 0.4);
  head.render();
  
  // Eyes & Pupils
  var leftEye = new Cube();
  leftEye.color = [1, 1, 1, 1];
  leftEye.matrix.translate(0.14, 0.5, 0.28);
  leftEye.matrix.scale(0.08, 0.08, 0.08);
  leftEye.render();

  var rightEye = new Cube();
  rightEye.color = [1, 1, 1, 1];
  rightEye.matrix.translate(-.11, 0.5, 0.28);
  rightEye.matrix.scale(0.08, 0.08, 0.08);
  rightEye.render();
  
  var leftPupil = new Cube();
  leftPupil.color = [0, 0, 0.5, 1]; // Dark blue pupil
  leftPupil.matrix.translate(.16, 0.52, 0.34);
  leftPupil.matrix.scale(0.04, 0.04, 0.04);
  leftPupil.render();
  
  var rightPupil = new Cube();
  rightPupil.color = [0, 0, 0.5, 1];
  rightPupil.matrix.translate(-.09, 0.52, 0.34);
  rightPupil.matrix.scale(0.04, 0.04, 0.04);
  rightPupil.render();
  
  // Beak (Using Pyramid.js)
  var beak = new Pyramid();
  beak.color = [1, 0.5, 0, 1]; // Orange
  beak.matrix.translate(.06, 0.45, 0.24);
  beak.matrix.scale(0.15, 0.15, 0.4);
  beak.render();
  
  // Arms
  var leftArm = new Cube();
  leftArm.color = [0, 0, 0, 1]; // Black arms
  leftArm.matrix.translate(-0.37, .15, .04);
  leftArm.matrix.rotate(g_joint5, 1, 0, 0);
  leftArm.matrix.scale(0.12, 0.4, 0.12);
  leftArm.render();

  var rightArm = new Cube();
  rightArm.color = [0, 0, 0, 1];
  rightArm.matrix.translate(0.37, .15, .04);
  rightArm.matrix.rotate(g_joint6, 1, 0, 0);
  rightArm.matrix.scale(0.12, 0.4, 0.12);
  rightArm.render();
  
  // Feet
  var leftFoot = new Cube();
  leftFoot.color = [1, 0.5, 0, 1];
  leftFoot.matrix.translate(-.22, -0.65, 0);
  leftFoot.matrix.rotate(g_joint3, 1, 0, 0);
  leftFoot.matrix.scale(0.15, 0.08, 0.25);
  leftFoot.render();
  
  var rightFoot = new Cube();
  rightFoot.color = [1, 0.5, 0, 1];
  rightFoot.matrix.translate(0.17, -0.65, 0);
  rightFoot.matrix.rotate(g_joint4, 1, 0, 0);
  rightFoot.matrix.scale(0.15, 0.08, 0.25);
  rightFoot.render();

  // Hat
  if (g_Hat_Animation == true) {
    // Hat (Base)
    var hatBase = new Cube();
    hatBase.color = [1, 0, 0, 1]; // Red hat base
    hatBase.matrix.translate(-0.15, 0.62, -0.15);
    hatBase.matrix.scale(0.42, 0.13, 0.48);
    hatBase.render();
    // Hat (Top)
    var hatTop = new Cube();
    hatTop.color = [1, 0, 0, 1]; // Red top
    hatTop.matrix.translate(-0.07, 0.71, -0.08);
    hatTop.matrix.scale(0.26, 0.17, 0.32);
    hatTop.render();
    // Hat Pom-Pom
    var hatPomPom = new Cube();
    hatPomPom.color = [1, 1, 1, 1]; // White pom-pom
    hatPomPom.matrix.translate(.003, 0.83, 0.04);
    hatPomPom.matrix.scale(0.12, 0.12, 0.12);
    hatPomPom.render();
  }
}
