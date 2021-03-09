window.oncontextmenu = function (event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

function saveImg() {
  var dataURL = canvas.toDataURL();
  document.getElementById("canvasImg").src = dataURL;

  var a = document.getElementById("download");
  a.href = dataURL;
}

function makeScreenshot() {
  saveImg();
  var sceenshotholder = document.getElementById("sceenshotholder");
  sceenshotholder.classList.toggle("show");

  var capture = document.getElementById("capture");
  capture.classList.toggle("hide");
}

function closeScreenshot() {
  makeScreenshot();
}

function hideScreenshot() {
  var sceenshotholder = document.getElementById("sceenshotholder");
  sceenshotholder.classList.remove("show");

  var capture = document.getElementById("capture");
  capture.classList.remove("swipeout");
}

function swipeOut() {
  var sceenshotholder = document.getElementById("sceenshotholder");
  sceenshotholder.classList.add("swipeout");
  sceenshotholder.addEventListener("animationend", removeSwipeOut);
}

function removeSwipeOut() {
  var capture = document.getElementById("capture");
  capture.classList.toggle("hide");

  var sceenshotholder = document.getElementById("sceenshotholder");
  sceenshotholder.classList.remove("swipeout");
  sceenshotholder.classList.remove("show");
}

//swipe

var sceenshotholder = document.getElementById("sceenshotholder");

sceenshotholder.addEventListener("touchstart", handleTouchStart, false);
sceenshotholder.addEventListener("touchmove", handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(evt) {
  return (
    evt.touches || evt.originalEvent.touches // browser API
  ); // jQuery
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      /* left swipe */
      swipeOut();
    } else {
      /* right swipe */
      swipeOut();
    }
  } else {
    if (yDiff > 0) {
      /* up swipe */
    } else {
      /* down swipe */
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}

// Share Sheet

function convertURIToImageData(URI) {
  return new Promise(function (resolve, reject) {
    if (URI == null) return reject();
    var canvas = document.createElement("canvas"),
      context = canvas.getContext("2d"),
      image = new Image();
    image.addEventListener(
      "load",
      function () {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(context.getImageData(0, 0, canvas.width, canvas.height));
      },
      false
    );
    image.src = URI;
  });
}

function download(dataurl, filename) {
  var dataURL = canvas.toDataURL();
  document.getElementById("canvasImg").src = dataURL;
}

// Markup
function expandMarkup() {
  var markup = document.getElementById("markup");
  markup.classList.add("active");
}

function collapseMarkup() {
  var markup = document.getElementById("markup");
  markup.classList.remove("active");
}

function Save() {
  localStorage.setItem(canvas, canvas.toDataURL());
}

//color swap
function drawBlack() {
  Dcolor = "#000000";
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    Dcolor = "#fff";
  }
}

function drawBlue() {
  Dcolor = "#177DF7";
}

function drawGreen() {
  Dcolor = "#5BC266";
}

function drawYellow() {
  Dcolor = "#FBCC43";
}

function drawRed() {
  Dcolor = "#F24F3B";
}

var activeclass = document.querySelectorAll(".colors .color");
for (var i = 0; i < activeclass.length; i++) {
  activeclass[i].addEventListener("click", activateClass);
}
function activateClass(e) {
  for (var i = 0; i < activeclass.length; i++) {
    activeclass[i].classList.remove("selected");
  }
  e.target.classList.add("selected");
}

// Fullscreen

/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

//event listner

document.addEventListener("fullscreenchange", (event) => {
  if (document.fullscreenElement) {
    console.log(
      `Element: ${document.fullscreenElement.id} entered full-screen mode.`
    );
  } else {
    console.log("Leaving full-screen mode.");
  }
});

// show touch stats
function showStats() {
  var stats = document.getElementById("stats");
  stats.classList.toggle("active");
}

function keyCheck(event) {
  var els = document.querySelectorAll(".selected");
  var x = event.keyCode;
  if (x == 70) {
    openFullscreen();
  } else if (x == 49) {
    for (var i = 0; i < els.length; i++) {
      els[i].classList.remove("selected");
    }
    var element = document.getElementById("black");
    element.classList.add("selected");
    drawBlack();
  } else if (x == 50) {
    for (var i = 0; i < els.length; i++) {
      els[i].classList.remove("selected");
    }
    var element = document.getElementById("blue");
    element.classList.add("selected");
    drawBlue();
  } else if (x == 51) {
    for (var i = 0; i < els.length; i++) {
      els[i].classList.remove("selected");
    }
    var element = document.getElementById("green");
    element.classList.add("selected");
    drawGreen();
  } else if (x == 52) {
    for (var i = 0; i < els.length; i++) {
      els[i].classList.remove("selected");
    }
    var element = document.getElementById("yellow");
    element.classList.add("selected");
    drawYellow();
  } else if (x == 53) {
    for (var i = 0; i < els.length; i++) {
      els[i].classList.remove("selected");
    }
    var element = document.getElementById("red");
    element.classList.add("selected");
    drawRed();
  } else if (x == 83) {
    makeScreenshot();
  } else if (x == 80) {
    expandMarkup();
  } else if (x == 79) {
    showStats();
  } else if (x == 67) {
    resetCanvas();
  } else if (x == 90) {
    if (event.shiftKey) {
      // redo, CMD+SHIFT+Z
      event.preventDefault();
      event.stopPropagation();
      // Do your Redo stuff
      redoLast();
    } else {
      // undo, CMD+Z
      event.preventDefault();
      event.stopPropagation();
      // Do your Undo stuff
      undoLast();
    }
  }
}
