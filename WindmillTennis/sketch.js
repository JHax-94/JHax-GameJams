var Engine = Matter.Engine,
  DebugRender = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Runner = Matter.Runner,
  Vector = Matter.Vector
  Events = Matter.Events,
  Constraint = Matter.Constraint;

var engine;
var world;
var debugRender;

var PADDLE_SPEED;

var runner;

var player1Score;
var player2Score;

var player1Goal;
var player2Goal;

var updatables = [];
var renderers = [];
var paddles = [];

var ball;

var ground;

var ballMoving;

function matterUpdate(deltaTime)
{
  for(var i = 0; i < updatables.length; i ++)
  {
    updatables[i].update(deltaTime);
  }
}

function handleCollisons(pairs)
{
  //console.log("handling collisions...");
  //console.log(pairs);
  for(var i = 0; i < pairs.length; i ++)
  {
    var pair = pairs[i];

    if( typeof(pair.bodyA.collisionExit) !== 'undefined')
    {
      pair.bodyA.collisionExit(pair.bodyB);
    }
    if( typeof(pair.bodyB.collisionExit) !== 'undefined')
    {
      pair.bodyB.collisionExit(pair.bodyA);
    }

  }
}

function setup() {
  // put setup code here 
  console.log("Running setup..."); 
  
  var canvas = createCanvas(1000, 400);
  canvas.parent('sketch-holder');

  runner = Runner.create();
  engine = Engine.create();
  /*
  debugRender = DebugRender.create({
    element: document.body,
    engine: engine
  });**/

  player1Score = 0;
  player2Score = 0;

  world = engine.world;
  world.gravity.y = 0;
  world.gravity.x = 0;

  PADDLE_SPEED = 4;

  Events.on(runner, "tick", function(args) {
    matterUpdate(args.source.delta / 1000);
  });

  Events.on(engine, 'collisionEnd', function(args) {
    console.log("Colliding...");
    handleCollisons(args.pairs.slice());
  });

  console.log(" --- LR ---");
  console.log(LEFT_ARROW);
  console.log(RIGHT_ARROW);

  Engine.run(engine);  
  Runner.run(runner, engine);
  //DebugRender.run(debugRender);

  var wall1 = new Wall(width/2, 0, width, 20);
  var wall2 = new Wall(width/2, height, width, 20);

  paddles.push(new Paddle(35, height/2, 20, 60, PADDLE_SPEED, "player1"));
  paddles.push(new Paddle(width-35, height /2, 20, 60, PADDLE_SPEED, "player2"));
  ball = new Ball(width/2, height/2, 10);

  player1Goal = new TriggerZone(0, height / 2, 30, height, "player1goal");
  player2Goal = new TriggerZone(width, height / 2, 30, height, "player2goal");

  ballMoving = false;
}

function increaseScore(player, increaseBy)
{
  if(player == 1)
  {
    player1Score += increaseBy;
  }
  else if(player == 2)
  {
    player2Score += increaseBy;
  }
}

function mousePressed() 
{
  
}

function keyPressed() {
  /*
  console.log("Key Pressed!");
  console.log(keyCode);
  */
  if(keyCode === 87 && paddles[0].upPressed === false)
  {
    paddles[0].upPressed = true;    
  }
  else if(keyCode === 83 && paddles[0].downPressed === false)
  {
    paddles[0].downPressed = true;
  }

  if(keyCode === UP_ARROW && paddles[1].upPressed === false)
  {
    paddles[1].upPressed = true;    
  }
  else if(keyCode === DOWN_ARROW && paddles[1].downPressed === false)
  {
    paddles[1].downPressed = true;
  }

  if(keyCode === 68 && paddles[0].rotateClock === false)
  {
    paddles[0].rotateClock = true;
  } 
  else if(keyCode === 65 && paddles[0].rotateAntiClock === false)
  {
    paddles[0].rotateAntiClock = true;
  }

  if(keyCode === LEFT_ARROW && paddles[1].rotateAntiClock === false)  
  {
    paddles[1].rotateAntiClock = true;
  }
  else if(keyCode == RIGHT_ARROW && paddles[1].rotateClock === false)
  {
    paddles[1].rotateClock = true;
  }

  if(keyCode === 32)
  {
    if(ballMoving === false)
    {
      //let newVelocity = Vector.create(10, 0);

      ballMoving = true;
      ball.setVelocity(-1, 0);
    }  
  }
}


function keyReleased()
{
  /*
  console.log("Key released!");
  console.log(keyCode);
  */
  if(keyCode === 87 && paddles[0].upPressed === true)
  {
    paddles[0].upPressed = false;
  }
  else if(keyCode == 83 && paddles[0].downPressed === true)
  {
    paddles[0].downPressed = false;
  }

  if(keyCode === UP_ARROW && paddles[1].upPressed === true)
  {
    paddles[1].upPressed = false;
  }
  else if(keyCode == DOWN_ARROW && paddles[1].downPressed === true)
  {
    paddles[1].downPressed = false;
  }

  if(keyCode === 68 && paddles[0].rotateClock === true)
  {
    paddles[0].rotateClock = false;
  }
  else if(keyCode === 65 && paddles[0].rotateAntiClock === true)
  {
    paddles[0].rotateAntiClock = false;
  }

  if(keyCode === LEFT_ARROW && paddles[1].rotateAntiClock === true)
  {
    paddles[1].rotateAntiClock = false;
  }
  else if(keyCode === RIGHT_ARROW && paddles[1].rotateClock === true)
  {
    paddles[1].rotateClock = false;
  }
}

function draw() {
  // put drawing code here
  //console.log("draw");
  background(51);

  for(var i = 0; i < renderers.length; i ++)
  {
      renderers[i].show();
  }

  fill(255);
  textSize(32);
  rectMode(CENTER);
  text(player1Score, 10, 30);
  rectMode(CENTER);
  text(player2Score, width - 25, 30);
}