document.addEventListener("DOMContentLoaded", () => {
  updateControls();
});

var $force = document.querySelectorAll("#force")[0];
var $touches = document.querySelectorAll("#touches")[0];
var canvas = document.querySelectorAll("canvas")[0];
var context = canvas.getContext("2d");

var lineWidth = 0;
var isMousedown = false;
points = [];

darkMode();

//darkmode
function darkMode() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    Dcolor = "#eeeff0";
  } else {
    Dcolor = "#000";
  }
}

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    const newColorScheme = e.matches ? "dark" : "light";

    darkMode();
  });

//orientation
window.addEventListener("orientationchange", function (event) {
  //console.log("the orientation of the device is now " + event.target.screen.orientation.angle);
  reSize();
});

canvas.width = window.innerWidth * 2;
canvas.height = window.innerHeight * 2;

//reset
function resetCanvas() {
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
}

//resize
function reSize() {
  canvas.width = window.innerWidth * 2;
  canvas.height = window.innerHeight * 2;
  context.clearRect(0, 0, canvas.width, canvas.height);
}

var requestIdleCallback =
  window.requestIdleCallback ||
  function (fn) {
    setTimeout(fn, 1);
  };

//undo
UndoCanvas.enableUndo(context);

const historyNoLabel = document.getElementById("historyNo");
const historySlider = document.getElementById("historySlider");
historySlider.min = 0;
historySlider.max = context.currentHistoryNo;

const updateControls = () => {
  historyNoLabel.value = context.currentHistoryNo;
  historySlider.max = context.newestHistoryNo;
  historySlider.value = context.currentHistoryNo;
};

historySlider.addEventListener("input", (e) => {
  e.preventDefault();
  context.currentHistoryNo = historySlider.value;
  updateControls();
});

["touchstart", "mousedown"].forEach(function (ev) {
  canvas.addEventListener(ev, function (e) {
    var pressure = 0.1;
    var x, y;
    if (
      e.touches &&
      e.touches[0] &&
      typeof e.touches[0]["force"] !== "undefined"
    ) {
      if (e.touches[0]["force"] > 0) {
        pressure = e.touches[0]["force"];
      }
      x = e.touches[0].pageX * 2;
      y = e.touches[0].pageY * 2;
    } else {
      pressure = 1.0;
      x = e.pageX * 2;
      y = e.pageY * 2;
    }

    isMousedown = true;

    lineWidth = Math.log(pressure + 1) * 40;
    context.lineWidth = lineWidth; // pressure * 50;
    context.strokeStyle = Dcolor;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(x, y);

    points.push({ x, y, lineWidth });
  });
});
["touchmove", "mousemove"].forEach(function (ev) {
  canvas.addEventListener(ev, function (e) {
    if (!isMousedown) return;
    e.preventDefault();

    var pressure = 0.1;
    var x, y;
    if (
      e.touches &&
      e.touches[0] &&
      typeof e.touches[0]["force"] !== "undefined"
    ) {
      if (e.touches[0]["force"] > 0) {
        pressure = e.touches[0]["force"];
      }
      x = e.touches[0].pageX * 2;
      y = e.touches[0].pageY * 2;
    } else {
      pressure = 1.0;
      x = e.pageX * 2;
      y = e.pageY * 2;
    }

    // smoothen line width
    lineWidth = Math.log(pressure + 1) * 40 * 0.2 + lineWidth * 0.8;

    points.push({ x, y, lineWidth });

    context.strokeStyle = Dcolor;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = lineWidth; // pressure * 50;
    // context.lineTo(x, y);
    // context.moveTo(x, y);

    if (points.length >= 3) {
      var l = points.length - 1;
      var xc = (points[l].x + points[l - 1].x) / 2;
      var yc = (points[l].y + points[l - 1].y) / 2;
      context.lineWidth = points[l - 1].lineWidth;
      context.quadraticCurveTo(points[l - 1].x, points[l - 1].y, xc, yc);
      context.stroke();
      context.beginPath();
      context.moveTo(xc, yc);
    }

    requestIdleCallback(() => {
      $force.textContent = "force = " + pressure;

      const touch = e.touches ? e.touches[0] : null;
      if (touch) {
        $touches.innerHTML = `
            touchType = ${touch.touchType} ${
          touch.touchType === "direct" ? "👆" : "✍️"
        } <br/>
            radiusX = ${touch.radiusX} <br/>
            radiusY = ${touch.radiusY} <br/>
            rotationAngle = ${touch.rotationAngle} <br/>
            altitudeAngle = ${touch.altitudeAngle} <br/>
            azimuthAngle = ${touch.azimuthAngle} <br/>
          `;
      }
    });
  });
});
["touchend", "touchleave", "mouseup"].forEach(function (ev) {
  canvas.addEventListener(ev, function (e) {
    var pressure = 0.1;
    var x, y;

    if (
      e.touches &&
      e.touches[0] &&
      typeof e.touches[0]["force"] !== "undefined"
    ) {
      if (e.touches[0]["force"] > 0) {
        pressure = e.touches[0]["force"];
      }
      x = e.touches[0].pageX * 2;
      y = e.touches[0].pageY * 2;
    } else {
      pressure = 1.0;
      x = e.pageX * 2;
      y = e.pageY * 2;
    }

    isMousedown = false;

    context.strokeStyle = Dcolor;
    context.lineCap = "round";
    context.lineJoin = "round";

    if (points.length >= 3) {
      var l = points.length - 1;
      context.quadraticCurveTo(points[l].x, points[l].y, x, y);
      context.stroke();
    }

    updateControls();
    points = [];
    lineWidth = 0;
  });
});

//Undo
function undoLast() {
  updateControls();
  context.undo();

  var element = document.getElementById("history");
  element.classList.add("activehistory");

  removeElems();
}

function redoLast() {
  context.redo();
}

function removeElems() {
  setTimeout(function () {
    var element = document.getElementById("history");
    element.classList.remove("activehistory");
  }, 4000);
}
