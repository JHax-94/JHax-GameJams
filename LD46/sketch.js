
var drawablesList = [];
var menuKeyReactors = [];

var animationsList = [];

var menuUpButton;
var menuDownButton;
var menuSubmitButton;

var menuUpHeld = false;
var menuDownHeld = false;
var menuSubmitHeld = false;

var gameMaster;
var fullTechsList;

var playerAnim = [];
var playerSheet;
var playerSheetData;


function setKeys()
{
  menuUpButton = UP_ARROW;
  menuDownButton = DOWN_ARROW;
  menuSubmitButton = RETURN;
}

function mod(val, comp)
{
  return (val + comp) % comp;
}

function setup() {
  // put setup code here
  console.log("Setup starting...");

  var canvas = createCanvas(1024, 768);
  canvas.parent('sketch-holder');
  var emperor = new Emperor(400, 1000);
  drawablesList.push(emperor);
  
  var moveList = [];

  /*
  moveList.push(new Technique("Attack", 50, 10));
  moveList.push(new Technique("Backflip", 0, 100));
  moveList.push(new Technique("Insult Enemy's Mother", 10, 60));
  */
  var moveBox = new MoveList(moveList);

  console.log(fullTechsList);

  for(var i = 0; i < fullTechsList.techniques.length && i < 4; i ++)
  {
    console.log("add tech...");
    var tech = new Technique(fullTechsList.techniques[i]);
    moveList.push(tech);
  }

  var player = new Player({x: 100, y: height/2}, moveList);
  
  var enemy = new Enemy({x: width - 100, y: height/2}, 100, 10);
  
  /*

  drawablesList.push(moveBox);
  drawablesList.push(player);
  */

  console.log("Load spritesheet");
  console.log(playerSheetData);
  for(var i = 0; i < playerSheetData.frames.length; i ++)
  {
    var pos = playerSheetData.frames[i].position;
    var img = playerSheet.get(pos.x, pos.y, pos.w, pos.h);
    playerAnim.push(img);
  }

  var playerSprite = new Sprite(playerAnim, 0.2);
  playerSprite.setDims({ w: 60, h: 120 });
  player.setSprite(playerSprite);

  var enemySprite = new Sprite(playerAnim, 0.2);
  enemySprite.setDims({ w: 60, h: 120 });
  enemy.setSprite(enemySprite);
  enemySprite.flip = true;

  gameMaster = new GameMaster();
  gameMaster.setEmperor(emperor);
  gameMaster.addPlayer(player);
  gameMaster.addEnemy(enemy);

  setKeys();
}

function preload()
{
  console.log("Preloading...")
  fullTechsList = loadJSON("assets/data/techniques.json");

  playerSheetData = loadJSON("assets/sprites/playerSheet.json");
  playerSheet = loadImage("assets/sprites/playerSheet.png");

  console.log("Preload complete!");
}

function keyPressed()
{
  if(keyCode === menuUpButton && menuUpHeld === false)
  {
    menuUpHeld = true;
  }
  else if(keyCode === menuDownButton && menuDownHeld === false)
  {
    menuDownHeld = true;
  }
  else if(keyCode === menuSubmitButton && menuSubmitHeld === false)
  {
    menuSubmitHeld = true;
  }
}

function keyReleased()
{
  if(keyCode === menuUpButton && menuUpHeld === true)
  {
    menuUpHeld = false;

    console.log("menu up!");

    for(var i = 0; i < menuKeyReactors.length; i ++)
    {
      menuKeyReactors[i].menuUp();
    }
  }
  else if(keyCode === menuDownButton && menuDownHeld === true)
  {
    console.log("menu down!");
    menuDownHeld = false;
    for(var i = 0; i < menuKeyReactors.length; i ++)
    {
      menuKeyReactors[i].menuDown();
    }
  }
  else if(keyCode === menuSubmitButton && menuSubmitHeld === true)
  {
    console.log("menu select!");
    menuSubmitHeld = false;
    for(var i = 0; i < menuKeyReactors.length; i ++)
    {
      menuKeyReactors[i].menuSubmit();
    }
  }
}

function draw() {
  // put drawing code here
  background(50);

  for(var i = 0; i < drawablesList.length; i++)
  {
    drawablesList[i].draw();
  }

  for(var i = 0; i < animationsList.length; i ++)
  {
    animationsList[i].animate();
  }
}