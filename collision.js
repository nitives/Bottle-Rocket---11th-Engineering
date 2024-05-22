var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var objects = [];
var gravity = 0.5;
var interval;

function addCircle() {
  var circle = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 20,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    color: "#e7e7e7",
  };
  objects.push(circle);
}

function startSimulation() {
  if (interval) clearInterval(interval);
  interval = setInterval(update, 20);
}

function stopSimulation() {
  clearInterval(interval);
}

function update() {
  // Caden's code i literally wrote all of this
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < objects.length; i++) {
    var obj = objects[i];
    obj.vy += gravity;
    obj.x += obj.vx;
    obj.y += obj.vy;

    // Collision detection with canvas boundaries
    if (obj.x + obj.radius > canvas.width) {
      obj.x = canvas.width - obj.radius;
      obj.vx *= -1;
    } else if (obj.x - obj.radius < 0) {
      obj.x = obj.radius;
      obj.vx *= -1;
    }

    if (obj.y + obj.radius > canvas.height) {
      obj.y = canvas.height - obj.radius;
      obj.vy *= -1;
    } else if (obj.y - obj.radius < 0) {
      obj.y = obj.radius;
      obj.vy *= -1;
    }

    // Draw the object
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
    ctx.fillStyle = obj.color;
    ctx.fill();
    ctx.closePath();
  }

  // Handle collisions between objects
  for (var i = 0; i < objects.length; i++) {
    for (var j = i + 1; j < objects.length; j++) {
      var obj1 = objects[i];
      var obj2 = objects[j];
      var dx = obj2.x - obj1.x;
      var dy = obj2.y - obj1.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < obj1.radius + obj2.radius) {
        // Simple elastic collision response
        var angle = Math.atan2(dy, dx);
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);

        // Rotate object1's position
        var x1 = 0;
        var y1 = 0;

        // Rotate object2's position
        var x2 = dx * cos + dy * sin;
        var y2 = dy * cos - dx * sin;

        // Rotate object1's velocity
        var vx1 = obj1.vx * cos + obj1.vy * sin;
        var vy1 = obj1.vy * cos - obj1.vx * sin;

        // Rotate object2's velocity
        var vx2 = obj2.vx * cos + obj2.vy * sin;
        var vy2 = obj2.vy * cos - obj2.vx * sin;

        // Collision reaction
        var vxTotal = vx1 - vx2;
        vx1 =
          ((obj1.radius - obj2.radius) * vx1 + 2 * obj2.radius * vx2) /
          (obj1.radius + obj2.radius);
        vx2 = vxTotal + vx1;

        // Update position to prevent objects from sticking together
        var absV = Math.abs(vx1) + Math.abs(vx2);
        var overlap = obj1.radius + obj2.radius - Math.abs(x2 - x1);

        x1 += (vx1 / absV) * overlap;
        x2 += (vx2 / absV) * overlap;

        // Rotate positions back
        obj1.x = obj1.x + (x1 * cos - y1 * sin);
        obj1.y = obj1.y + (y1 * cos + x1 * sin);
        obj2.x = obj1.x + (x2 * cos - y2 * sin);
        obj2.y = obj1.y + (y2 * cos + x2 * sin);

        // Rotate velocities back
        obj1.vx = vx1 * cos - vy1 * sin;
        obj1.vy = vy1 * cos + vx1 * sin;
        obj2.vx = vx2 * cos - vy2 * sin;
        obj2.vy = vy2 * cos + vx2 * sin;
      }
    }
  }
}
