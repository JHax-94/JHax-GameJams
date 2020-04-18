const TITLE_SCREEN = 0;
const PRE_BATTLE_SCREEN = 1;
const BATTLE_SCREEN = 2;

var screens = [];

var menuUpButton;
var menuDownButton;
var menuSubmitButton;

var arenaBg;

var thumbsDown;
var thumbsUp;
var title;

var menuUpHeld = false;
var menuDownHeld = false;
var menuSubmitHeld = false;

var activeScreen = TITLE_SCREEN;

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

function setActiveScreen(newScreen)
{
  activeScreen = newScreen;
}

function setup() {
  // put setup code here
  console.log("Setup starting...");
  var canvas = createCanvas(1024, 768);
  canvas.parent('sketch-holder');

  var titleScreen = new Screen();
  screens.push(titleScreen);
  var preBattleScreen = new Screen();
  screens.push(preBattleScreen);
  var battleScreen = new Screen();
  screens.push(battleScreen);

  console.log(screens);

  var emperor = new Emperor(400, 1000);
  //drawablesList.push(emperor);
  
  var moveList = [];

  var moveBox = new MoveList(moveList);

  console.log(fullTechsList);

  for(var i = 0; i < fullTechsList.techniques.length && i < 4; i ++)
  {
    console.log("add tech...");
    var tech = new Technique(fullTechsList.techniques[i]);
    moveList.push(tech);
  }

  var player = new Player({x: 150, y: height/2 + 100}, moveBox);
  
  var enemy = new Enemy({x: width - 150, y: height/2 + 100}, 100, 60);
  
  console.log("Load spritesheet");
  console.log(playerSheetData);
  for(var i = 0; i < playerSheetData.frames.length; i ++)
  {
    var pos = playerSheetData.frames[i].position;
    var img = playerSheet.get(pos.x, pos.y, pos.w, pos.h);
    playerAnim.push(img);
  }

  var playerSprite = new Sprite(playerAnim, 0.2, BATTLE_SCREEN);
  playerSprite.setDims({ w: 60, h: 120 });
  player.setSprite(playerSprite);

  var enemySprite = new Sprite(playerAnim, 0.2, BATTLE_SCREEN);
  enemySprite.setDims({ w: 60, h: 120 });
  enemy.setSprite(enemySprite);
  enemySprite.flip = true;

  gameMaster = new GameMaster();
  gameMaster.setEmperor(emperor);
  gameMaster.addPlayer(player);
  gameMaster.addEnemy(enemy);
  gameMaster.nextTurn();

  var titles = new TitleScreen({ x: width / 2, y: height / 2 - 100 }, title);

  setKeys();
}

function preload()
{
  console.log("Preloading...");

  title = loadImage("assets/sprites/title.png");

  arenaBg = loadImage("assets/sprites/arenaBackground.png");
  thumbsUp = loadImage("assets/sprites/thumbsUp.png");
  thumbsDown = loadImage("assets/sprites/thumbsDown.png");

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

    screens[activeScreen].menuUp();
  }
  else if(keyCode === menuDownButton && menuDownHeld === true)
  {
    menuDownHeld = false;
    screens[activeScreen].menuDown();
  }
  else if(keyCode === menuSubmitButton && menuSubmitHeld === true)
  {
    menuSubmitHeld = false;
    screens[activeScreen].menuSubmit();
  }
}

function draw() {
  clear();
  imageMode(CORNER);
  background(arenaBg);
  
  screens[activeScreen].update(deltaTime/1000);
  screens[activeScreen].draw();
  screens[activeScreen].animate();
}