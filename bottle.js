var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var altitudeDisplay = document.getElementById("altitudeDisplay");
var rocket = {
  x: canvas.width / 2,
  y: canvas.height - 20, // Making sure the bottle starts on the ground
  width: 40,
  height: 200,
  vy: 0,
  thrust: 0,
  gravity: 9.8,
  mass: 1,
  waterHeight: 0,
  airPressure: 5,
  bottleSize: 2,
  waterAmount: 1,
  altitude: 0,
};
var launched = false;
var interval;

var bottleImg = new Image();
bottleImg.src = "bottle.png"; // Photo the da bottle

function updateLabel(labelId, value) {
  document.getElementById(labelId).innerText = value;
}

function updateRocketProperties() {
  var bottleSize = parseFloat(document.getElementById("bottleSize").value);
  var waterAmount = parseFloat(document.getElementById("waterAmount").value);
  var airPressure = parseFloat(document.getElementById("airPressure").value);

  rocket.bottleSize = bottleSize;
  rocket.waterAmount = waterAmount;
  rocket.airPressure = airPressure;

  rocket.mass = bottleSize + waterAmount * 0.1; // Mass calculation
  rocket.thrust = waterAmount * airPressure * 10; // Thrust calculation
  rocket.gravity = 9.8;

  rocket.width = 20 * bottleSize; // Adjust rocket width based on bottle size
  rocket.height = 100 * bottleSize; // Adjust rocket height based on bottle size
  rocket.waterHeight = rocket.height * (waterAmount / bottleSize); // Water level in the bottle

  updateLabel("bottleSizeLabel", bottleSize);
  updateLabel("waterAmountLabel", waterAmount);
  updateLabel("airPressureLabel", airPressure);

  drawRocket();
}

function calculateThrust() {
  rocket.thrust = rocket.waterAmount * rocket.airPressure * 10; // Thrust calculation
}

function drawHeightMarkers() {
  ctx.fillStyle = "white";
  ctx.font = "12px SF Pro Display";
  ctx.textAlign = "right";
  var markerInterval = 50; // 50 pixels per marker
  var heightPerPixel = 0.254 / rocket.height; // Height in meters per pixel

  for (var i = 0; i <= canvas.height * 2; i += markerInterval) {
    var heightInMeters = (i * heightPerPixel).toFixed(1);
    var yPosition = canvas.height - i;
    ctx.fillRect(0, yPosition, 10, 1); // Height marker line
    ctx.fillText(`${heightInMeters} m`, 50, yPosition + 3); // Height marker line label
  }
}

function drawRocket() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Create grass
  ctx.fillStyle = "#358035";
  ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

  // Adjusting the canvas view based on rocket's altitude
  ctx.save();
  var translateY = 0;
  if (launched && rocket.y < canvas.height / 2) {
    translateY = canvas.height / 2 - rocket.y;
    ctx.translate(0, translateY);
  }

  // Draw height markers
  drawHeightMarkers();

  // Draw the bottle
  ctx.drawImage(
    bottleImg,
    rocket.x - rocket.width / 2,
    rocket.y - rocket.height,
    (rocket.width = 60),
    rocket.height
  );

  // Draw the water inside the bottle
  ctx.fillStyle = "#82adda";

  // Calculate the point where the bottle narrows to a cone
  var coneHeight = rocket.height * 0.25; // 25% of the height is the cone part
  var straightHeight = rocket.height - coneHeight;

  // Draw the straight part of the water
  if (rocket.waterHeight > straightHeight) {
    ctx.fillRect(
      rocket.x - rocket.width / 2,
      rocket.y - straightHeight,
      rocket.width,
      straightHeight
    );
    // Draw cone part of the water
    var coneWaterHeight = rocket.waterHeight - straightHeight;
    ctx.beginPath();
    ctx.moveTo(rocket.x - rocket.width / 2, rocket.y - straightHeight);
    ctx.lineTo(rocket.x + rocket.width / 2, rocket.y - straightHeight);
    ctx.lineTo(rocket.x, rocket.y - straightHeight - coneWaterHeight);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillRect(
      rocket.x - rocket.width / 2,
      rocket.y - rocket.waterHeight,
      rocket.width,
      rocket.waterHeight
    );
  }

  ctx.restore();
}

function update() {
  if (launched) {
    rocket.vy += rocket.gravity * 0.02;
    rocket.y += rocket.vy;

    // Update altitude
    rocket.altitude = (canvas.height - 20 - rocket.y) * (0.254 / rocket.height); // Convert to meters (assuming 10.2 inches is 0.254 meters)
    var altitudeFeet = rocket.altitude * 3.28084; // Convert meters to feet
    altitudeDisplay.innerText = `Altitude: ${Math.max(
      0,
      rocket.altitude.toFixed(2)
    )} m / ${Math.max(0, altitudeFeet.toFixed(2))} ft`;

    // Collision with ground
    if (rocket.y >= canvas.height - 20) {
      rocket.y = canvas.height - 20;
      rocket.vy = 0;
      launched = false;
    }
  }
  drawRocket();
}

function launchRocket() {
  if (!launched) {
    calculateThrust();
    rocket.vy = -rocket.thrust / rocket.mass;
    launched = true;
  }
}

function resetRocket() {
  rocket.x = canvas.width / 2;
  rocket.y = canvas.height - 20; // Make sure the bottle starts on the ground again
  rocket.vy = 0;
  rocket.altitude = 0;
  launched = false;
  altitudeDisplay.innerText = "Altitude: 0 m / 0 ft";
  drawRocket();
}

bottleImg.onload = function () {
  drawRocket(); // Make sure the rocket is drawn on load
  setInterval(update, 20);
};
