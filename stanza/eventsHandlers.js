window.addEventListener("keydown", doKeyDown, true);
window.addEventListener("keyup", doKeyUp, true);
window.addEventListener("touchstart", doTouchDown, true);
window.addEventListener("touchend", doTouchUp, true);

var pointerX = -1;
var pointerY = -1;
document.onmousemove = function (event) {
  pointerX = event.pageX;
  pointerY = event.pageY;
};
setInterval(pointerCheck, 1000);
function pointerCheck() {
  //console.log("Cursor at: " + pointerX + ", " + pointerY);
}

function zoom(event) {
  event.preventDefault();
  D += event.deltaY * +0.01;
}

function mouseDown(e) {
  //console.log("mouseDown");
  drag = true;
  cameraLiberabis = true;
  (old_x = e.pageX), (old_y = e.pageY);
  e.preventDefault();
  return false;
}

function mouseUp(e) {
  drag = false;
  //cameraLiberabis = false;
}

function mouseMove(e) {
  if (!drag) return false;
  //console.log("mouseMove");
  dX = (-(e.pageX - old_x) * 2 * Math.PI) / canvas.width;
  dY = (-(e.pageY - old_y) * 2 * Math.PI) / canvas.height;
  //console.log("dX: " + dX + " dY: " + dY);
  THETA += dX;
  PHI += dY;
  if (PHI < 0.22) {
    PHI = 0.22;
  }
  if (THETA > 3.05) {
    THETA = 3.05;
  }
  if (PHI > 3.05) {
    PHI = 3.05;
  }
  //console.log("THETA: " + THETA + " PHI: " + PHI);
  (old_x = e.pageX), (old_y = e.pageY);
  e.preventDefault();
}

//Premo il tasto
function doKeyDown(e) {
  switch (e.key) {
    case "w":
      key[0] = true;
      break;
    case "a":
      key[1] = true;
      break;
    case "s":
      key[2] = true;
      break;
    case "d":
      key[3] = true;
      break;
    case "ArrowUp":
      cameraPosition[1] += 0.14;
      camera_posteriore=false;
      cambiaCamera=false;
      cameraLiberabis = false;
      break;
    case "ArrowDown":
      camera_posteriore=false;
      cameraPosition[1] -= 0.14;
      cambiaCamera=false;
      cameraLiberabis = false;
      break;
    case "ArrowLeft":
      camera_posteriore=false;
      cameraPosition[0] -= 0.14;
      cambiaCamera=false;
      cameraLiberabis = false;
      break;
    case "ArrowRight":
      camera_posteriore=false;
      cameraPosition[0] += 0.14;
      cambiaCamera=false;
      cameraLiberabis = false;
      break;
    default:
      return;
  }
}

//Rilascio il tasto premuto
function doKeyUp(e) {
  switch (e.key) {
    case "w":
      key[0] = false;
      break;
    case "a":
      key[1] = false;
      break;
    case "s":
      key[2] = false;
      break;
    case "d":
      key[3] = false;
      break;
    case "ArrowUp":
      break;
    case "ArrowDown":
      break;
    case "ArrowLeft":
      break;
    case "ArrowRight":
      break;
    default:
      return;
  }
}

function doTouchDown(e) {
  touch = e.touches[0];
  x = touch.pageX - canvas.offsetLeft;
  y = touch.pageY - canvas.offsetTop;

  // THE W KEY
  if (x >= 190 && y >= 351 && x <= 250 && y <= 417) {
    key[0] = true;
    //cameraLibera = false;
  }
  // THE S KEY
  if (x >= 190 && y >= 439 && x <= 251 && y <= 500) {
    key[2] = true;
    //cameraLibera = false;
  }
  // THE A KEY
  if (x >= 106 && y >= 438 && x <= 167 && y <= 503) {
    key[1] = true;
    //cameraLibera = false;
  }
  // THE D KEY
  if (x >= 274 && y >= 440 && x <= 335 && y <= 504) {
    key[3] = true;
    //cameraLibera = false;
  }

  // THE up KEY
  if (x >= 640 && y >= 351 && x <= 700 && y <= 417) {
    cameraPosition[1] += 1;
    camera_posteriore=false;
    cambiaCamera=false;
    cameraLiberabis = false;
    //console.log("cameralibera" + cameraLibera);
  }
  // THE down KEY
  if (x >= 640 && y >= 439 && x <= 700 && y <= 500) {
    cameraPosition[1] -= 1;
    camera_posteriore=false;
    cambiaCamera=false;
    cameraLiberabis = false;
  }
  // THE left KEY
  if (x >= 556 && y >= 438 && x <= 617 && y <= 503) {
    cameraPosition[0] -= 1;
    camera_posteriore=false;
    cambiaCamera=false;
    cameraLiberabis = false;
  }
  // THE right KEY
  if (x >= 724 && y >= 440 && x <= 785 && y <= 504) {
    cameraPosition[0] += 1;
    camera_posteriore=false;
    cambiaCamera=false;
    cameraLiberabis = false;
  }
}

function doTouchUp(e) {
  x = touch.pageX - canvas.offsetLeft;
  y = touch.pageY - canvas.offsetTop;
  // THE W KEY
  if (x >= 190 && y >= 351 && x <= 250 && y <= 417) key[0] = false;
  // THE S KEY
  if (x >= 190 && y >= 439 && x <= 251 && y <= 500) key[2] = false;
  // THE A KEY
  if (x >= 106 && y >= 438 && x <= 167 && y <= 503) key[1] = false;
  // THE D KEY
  if (x >= 274 && y >= 440 && x <= 335 && y <= 504) key[3] = false;
}

window.addEventListener("click", checkButtonClick);

function checkButtonClick(e) {
  x = e.pageX - canvas.offsetLeft;
  y = e.pageY - canvas.offsetTop;
  //retry button
  if (x >= 490 && x <= 650 && y >= 178 && y <= 236 && morte == true) {
    initMouse();
    morte= false;
    cambiaCamera= false;
    cameraLiberabis= false;
    cameraA= false;
    provetta1= false;
    provetta2= false;
    provetta2= false;
    webglLessonsUI.setupSlider("#LightX", {value: 270, slide: updateLightx, min: 0,max: 450, step: 1,});
    webglLessonsUI.setupSlider("#LightY", {value: 200,slide: updateLighty,min: 100, max: 450,step: 1,});
    webglLessonsUI.setupSlider("#LightZ", {value: 250,slide: updateLightz,min: 100,max: 350, step: 1,});
    x_light= 10;
    y_light= 200;
    z_light= 250;
    cambiaCamera= false;
    cameraL2= false;
    cameraA= false; 
    cameraL= false;
    cameraP=true;
  }
}
