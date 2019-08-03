let snake;
let apple;

let SPEED = 0.1
let last = null

let DIR = null

let local_storage_name = "hyperbolicsnake"
let high_score = []



function setup() {
  var cnv = createCanvas(windowHeight, windowHeight)
  cnv.position(windowWidth/2 - width/2, 0)
  let test_point = new Point(0.86, 0.2223)
  test_point.direction = HALF_PI

  frameRate(15)

  textSize(30)

  snake = new Snake([test_point])
  apple = new Apple()
  snake.goal = apple

  var s_high_score = s_array(high_score)
  var html_high_score = document.getElementById("score_table00")

  if (localStorage.getItem(local_storage_name) == null) {
    high_score = [0]
  } else {
    high_score = localStorage.getItem(local_storage_name)
  }
  
  html_high_score.innerHTML = "High scores: " + s_high_score

  
}

function draw() {
  var x = Math.cos(0.2223)
  var y = Math.sin(0.2223)
  var leave = false

  background(255)
  stroke(0)
  strokeWeight(4)
  noFill()
  ellipse(Math.floor(width / 2), Math.floor(height / 2), width, width)

  if (DIR === LEFT_ARROW) {
    snake.left_turn()
    DIR = null
  } else if (DIR === RIGHT_ARROW) {
    snake.right_turn()
    DIR = null
  }




  snake.move()
  snake.plot()
  apple.plot()

  if (snake.dead || leave === true) {
    if (snake.length > high_score[9]) {
      high_score.push(snake.length)
      high_score.sort()

      localStorage.setItem(local_storage_name, high_score)
    } 

    var s_high_score = s_array(high_score)
    var html_high_score = document.getElementById("score_table00")

    html_high_score.innerHTML = "High scores: \n" + s_high_score

    print("Score: ", snake.length)
    text("Score: " + str(snake.length), 750, 50)
    noLoop()
  }
}


function move_point(p, d, angle) { // TODO problem here?
  var sign4 = d / Math.abs(d)
  if (angle < (-1 * PI)) {
    angle += TWO_PI
  }
  if (angle > PI) {
    angle -= TWO_PI
  }
  var sign1 = Math.abs(angle) / angle

  var new_r = Math.acosh((Math.cosh(p.r) * Math.cosh(d)) - (Math.sinh(p.r) * Math.sinh(d) * Math.cos(angle)))
  var test = (Math.cosh(p.r) * Math.cosh(new_r) - Math.cosh(d)) / (Math.sinh(p.r) * Math.sinh(new_r))

  if (test < 1.0) {
    p.theta += sign1 * sign4 * Math.acos(test)
  } else {
    p.theta += 0
  }
  var new_angle = sign1 * Math.acos((Math.cosh(p.r) - (Math.cosh(new_r) * Math.cosh(d))) / (Math.sinh(new_r) * Math.sinh(d)))
  p.r = new_r
  p.direction = new_angle
}


function intersect(circle1, circle2) {
  var eucl_r1 = Math.tanh(circle1.r / 2)
  var x1 = eucl_r1 * Math.cos(circle1.theta)
  var y1 = eucl_r1 * Math.sin(circle1.theta)
  var circ_r1 = circle1.rad_mod * Math.abs(eucl_r1 - Math.tanh(circle1.r / 2 - SPEED / 4))

  var eucl_r2 = Math.tanh(circle2.r / 2)
  var x2 = eucl_r2 * Math.cos(circle2.theta)
  var y2 = eucl_r2 * Math.sin(circle2.theta)
  var circ_r2 = circle2.rad_mod * Math.abs(eucl_r2 - Math.tanh(circle2.r / 2 - SPEED / 4))

  var dist = (x1 - x2) ** 2 + (y1 - y2) ** 2

  if (dist < (circ_r1 + circ_r2) ** 2) {
    return true
  } else {
    return false
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) {
    DIR = LEFT_ARROW
  } else if (keyCode === RIGHT_ARROW) {
    DIR = RIGHT_ARROW
  }
  return false
}

function touchStarted() {
  if (mouseX < width / 2) {
    // text("TOUCHED")
    DIR = LEFT_ARROW
  } else if (mouseX >= width / 2) {
    // text("TOUCHED")
    DIR = RIGHT_ARROW
  }
}

function s_array(arr) {
  var s = ''
  if (arr.length === 0) {
    return s
  } else {
    for (var el of arr) {
      s += str(el) + '\n'
    }
  }
  return s
}