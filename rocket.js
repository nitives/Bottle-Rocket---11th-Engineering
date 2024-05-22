var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var rocket = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 10,
  height: 40,
  vy: 0,
  thrust: -2,
  gravity: 0.05,
};
var launched = false;

function drawRocket() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  ctx.fillRect(
    rocket.x - rocket.width / 2,
    rocket.y - rocket.height,
    rocket.width,
    rocket.height
  );
}

function update() {
  if (launched) {
    rocket.vy += rocket.gravity;
    rocket.y += rocket.vy;

    if (rocket.y - rocket.height > canvas.height) {
      launched = false;
    }
  }
  drawRocket();
}

function launchRocket() {
  if (!launched) {
    rocket.vy = rocket.thrust;
    launched = true;
  }
}

function resetRocket() {
  rocket.x = canvas.width / 2;
  rocket.y = canvas.height - 50;
  rocket.vy = 0;
  launched = false;
  drawRocket();
}

setInterval(update, 20);
drawRocket();
