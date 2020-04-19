const TITLE_SCREEN = 0;
const PRE_BATTLE_SCREEN = 1;
const BATTLE_SCREEN = 2;
const LOADOUT_SCREEN = 3;

var screens = [];

var menuUpButton;
var menuDownButton;
var menuLeftButton;
var menuRightButton;

var menuSubmitButton;

var arenaBg;

var thumbsDown;
var thumbsUp;
var title;

var menuUpHeld = false;
var menuDownHeld = false;
var menuLeftHeld = false;
var menuRightHeld = false;
var menuSubmitHeld = false;

var activeScreen = PRE_BATTLE_SCREEN;

var gameMaster;
var fullTechsList;
var shop;
var loadouts;

var player;

var PLAYER_LOADOUT = {};
var NEXT_OPPONENT_LIST;

var playerAnim = [];
var playerSheet;
var playerSheetData;

var preBattleMenu;

function setKeys()
{
  menuUpButton = UP_ARROW;
  menuDownButton = DOWN_ARROW;
  menuSubmitButton = RETURN;
  menuRightButton = RIGHT_ARROW;
  menuLeftButton = LEFT_ARROW;
}

function mod(val, comp)
{
  return (val + comp) % comp;
}

function setActiveWeapon(weaponName)
{
  for(var i = 0; i < PLAYER_LOADOUT.inventory.length; i ++)
  {
    PLAYER_LOADOUT.inventory[i].active = PLAYER_LOADOUT.inventory[i].name == weaponName;
  }
}

function setActiveScreen(newScreen)
{
  if(newScreen === BATTLE_SCREEN)
  {
    console.log("Resetting battle state");
    gameMaster.reset();
  }
  else if(newScreen === PRE_BATTLE_SCREEN)
  {
    console.log("Reset pre battle menu");
    preBattleMenu.resetSelection(1);
  }
  else if(newScreen === LOADOUT_SCREEN)
  {
    console.log("Update loadout options");
    loadouts.reset(PLAYER_LOADOUT);
  }
  
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
  var loadoutScreen = new Screen();
  screens.push(loadoutScreen);

  console.log(screens);

  var emperor = new Emperor(400, 1000);
  
  console.log(fullTechsList);

  var startTech = fullTechsList.startingTechniques;
  
  PLAYER_LOADOUT.techs = [];
  for(var i = 0; i < fullTechsList.techniques.length; i ++)
  {
    var startingTech = false;

    for(var j = 0; j < startTech.length && startingTech === false; j ++)
    {
      if(startTech[j] === fullTechsList.techniques[i].name)
      {
        startingTech = true;
      }
    }

    fullTechsList.techniques[i].owned = startingTech;
    fullTechsList.techniques[i].equipped = startingTech;

    console.log("--- TECH ADDED ---");
    var newTech = new Technique(fullTechsList.techniques[i]);
    console.log(newTech);

    PLAYER_LOADOUT.techs.push(newTech);
  }

  PLAYER_LOADOUT.inventory = [];
  for(var i = 0; i < shop.shopItems.length; i ++)
  {
    var startingItem = false;
    for(var j = 0; j < shop.startingItems.length && startingItem === false; j ++)
    {
      if(shop.shopItems[i].name === shop.startingItems[j])
      {
        startingItem = true;
      }
    }
    
    shop.shopItems[i].owned = startingItem;
    shop.shopItems[i].equipped = startingItem;

    PLAYER_LOADOUT.inventory.push(shop.shopItems[i]);
  }

  player = new Player({x: 150, y: height/2 + 100}, 10000, );
  
  var enemy = new Enemy({x: width - 150, y: height/2 + 100}, 100, 60, 50);
  
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

  var titles = new TitleScreen({ x: width / 2, y: height / 2 - 50 }, title);
  preBattleMenu = new PreBattleScreen({x: width/2, y: height/2}, {w: width - 100, h: height - 100}, 1, shop, fullTechsList);
  loadouts = new LoadoutScreen({ x: width / 2, y: height /2 }, { w: width / 2, h: height / 2}, PLAYER_LOADOUT);

  console.log(PLAYER_LOADOUT);

  textSize(24);
  setKeys();
  console.log("Setup finished...");
}

function buyItem(name)
{
  var nameFound = false;
  for(var i = 0; i < PLAYER_LOADOUT.inventory.length && nameFound === false; i ++)
  {
    if(PLAYER_LOADOUT.inventory[i].name === name)
    {
      PLAYER_LOADOUT.inventory[i].owned = true;
      nameFound = true;
    }
  }
}

function buyTech(name)
{
  var nameFound = false;
  for(var i = 0; i < PLAYER_LOADOUT.techs.length && nameFound === false; i ++)
  {
    if(PLAYER_LOADOUT.techs[i].name === name)
    {
      PLAYER_LOADOUT.techs[i].owned = true;
      nameFound = true;
    }
  }
}

function getActiveWeapon()
{
  var weapon = 0;
  for(var i = 0; i < PLAYER_LOADOUT.inventory.length; i ++)
  {
    if(PLAYER_LOADOUT.inventory[i].active === true)
    {
      weapon = PLAYER_LOADOUT.inventory[i];
    }
  }
  return weapon;
}

function preload()
{
  console.log("Preloading...");

  title = loadImage("assets/sprites/title.png");

  arenaBg = loadImage("assets/sprites/arenaBackground.png");
  thumbsUp = loadImage("assets/sprites/thumbsUp.png");
  thumbsDown = loadImage("assets/sprites/thumbsDown.png");

  fullTechsList = loadJSON("assets/data/techniques.json");
  shop = loadJSON("assets/data/shop.json");

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
  else if(keyCode === menuLeftButton && menuLeftHeld === false)
  {
    menuLeftHeld = true;
  }
  else if(keyCode === menuRightButton && menuRightHeld === false)
  {
    menuRightHeld = true;
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
  else if(keyCode === menuLeftButton && menuLeftHeld === true)
  {
    console.log("Menu left!");
    menuLeftHeld = false;
    screens[activeScreen].menuLeft();    
  }
  else if(keyCode === menuRightButton && menuRightHeld === true)
  {
    console.log("Menu right!");
    menuRightHeld = false;
    screens[activeScreen].menuRight();
  }
}

function draw() {
  clear();
  textSize(18);
  imageMode(CORNER);
  background(arenaBg);
  
  screens[activeScreen].update(deltaTime/1000);
  screens[activeScreen].draw();
  screens[activeScreen].animate();
}