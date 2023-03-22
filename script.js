// function setup() {
//   createCanvas(windowWidth, windowHeight)
// }

// function draw() {
//   background(100);

//   let x = [];
//   let y = [];


//   for (let i = 0; i < 100; i++) {
//     let x = Math.floor(Math.random())
//   }
  

// }

let gridSize = 256;
let scale = 2;
let du = 0.16;
let dv = 0.08;
let f = 0.035;
let k = 0.06;
let timeStep = 1;

let u = [];
let v = [];
let nextU = [];
let nextV = [];

function setup() {
  createCanvas(gridSize * scale, gridSize * scale);
  
  for (let i = 0; i < gridSize; i++) {
    u[i] = [];
    v[i] = [];
    nextU[i] = [];
    nextV[i] = [];
    
    for (let j = 0; j < gridSize; j++) {
      u[i][j] = 1.0;
      v[i][j] = 0.0;
      nextU[i][j] = 0.0;
      nextV[i][j] = 0.0;
      
      if (i > 100 && i < 150 && j > 100 && j < 150) {
        u[i][j] = 0.5;
        v[i][j] = 0.25;
      }
    }
  }
  
  noStroke();
  pixelDensity(1);
}

function draw() {
  loadPixels();
  
  for (let i = 1; i < gridSize - 1; i++) {
    for (let j = 1; j < gridSize - 1; j++) {
      let laplacianU = (u[i - 1][j] + u[i + 1][j] + u[i][j - 1] + u[i][j + 1] - 4 * u[i][j]);
      let laplacianV = (v[i - 1][j] + v[i + 1][j] + v[i][j - 1] + v[i][j + 1] - 4 * v[i][j]);
      let uvv = u[i][j] * v[i][j] * v[i][j];
      
      nextU[i][j] = u[i][j] + timeStep * (du * laplacianU - uvv + f * (1.0 - u[i][j]));
      nextV[i][j] = v[i][j] + timeStep * (dv * laplacianV + uvv - (f + k) * v[i][j]);
      
      let color = floor(255 * (nextU[i][j] - nextV[i][j]));
      color = constrain(color, 0, 255);
      
      let index = (i * scale + j * scale * gridSize * scale) * 4;
      pixels[index] = color;
      pixels[index + 1] = color;
      pixels[index + 2] = color;
      pixels[index + 3] = 255;
    }
  }
  
  updatePixels();
  
  let temp = u;
  u = nextU;
  nextU = temp;
  
  temp = v;
  v = nextV;
  nextV = temp;
}