const TITLE_SCREEN = 0;
const PRE_BATTLE_SCREEN = 1;
const BATTLE_SCREEN = 2;
const LOADOUT_SCREEN = 3;
const GAME_END = 4;

var FORCE_RANDOM = false;

var BACKGROUND;

var screens = [];

var enemyId = 0;

var menuUpButton;
var menuDownButton;
var menuLeftButton;
var menuRightButton;
var menuBackButton;

var menuSubmitButton;

var arenaBg;
var preBattleBg;

var thumbsDown;
var thumbsUp;
var title;

var battleGenerator;

var LEVEL_DATA;
var TUTORIAL_ON = true;

var END_STATE = {};

var menuUpHeld = false;
var menuDownHeld = false;
var menuLeftHeld = false;
var menuRightHeld = false;
var menuSubmitHeld = false;
var menuBackHeld = false;

var BATTLE_COUNTER = 0;

var activeScreen = TITLE_SCREEN;

var gameMaster;
var fullTechsList;
var shop;
var loadouts;
var endWindow;

var player;

var PLAYER_LOADOUT = {};
var NEXT_OPPONENT_LIST = {};

var playerAnim = [];
var playerSheet;
var playerSheetData;

var preBattleMenu;

var characterAtlas;
var characterAtlasData;

var ANIMATIONS;

function setKeys()
{
  menuUpButton = UP_ARROW;
  menuDownButton = DOWN_ARROW;
  menuSubmitButton = RETURN;
  menuRightButton = RIGHT_ARROW;
  menuLeftButton = LEFT_ARROW;
  menuBackButton = ESCAPE;
}

function mod(val, comp)
{
  return (val + comp) % comp;
}

function setActiveWeapon(weaponName, equipToPlayer)
{
  //console.log("==== SETTING ACTIVE WEAPON TO " + weaponName + " ====");

  var inventoryItem = {}
  for(var i = 0; i < PLAYER_LOADOUT.inventory.length; i ++)
  {
    PLAYER_LOADOUT.inventory[i].active = PLAYER_LOADOUT.inventory[i].name == weaponName;
    if(PLAYER_LOADOUT.inventory[i].name == weaponName)
    {
      inventoryItem = PLAYER_LOADOUT.inventory[i];
    }
  }

  //console.log(PLAYER_LOADOUT);

  equipToPlayer.moveList.setEquippedWeapons(PLAYER_LOADOUT.inventory);
  var animIndex = getWeaponAnimIndex(inventoryItem.anim);
  var animation = ANIMATIONS.WEAPONS[animIndex];

  /*
  console.log("Set Weapon animation...");
  console.log(animation);
  */
  player.switchWeaponAnimation(animation);

}

function setActiveScreen(newScreen)
{
  if(this.activeScreen === TITLE_SCREEN && newScreen === PRE_BATTLE_SCREEN)
  {
    if(TUTORIAL_ON === false)
    {
      BATTLE_COUNTER = LEVEL_DATA.skipTutorial;
    }

    gameMaster.prepareEnemyList();
    gameMaster.nextTurn();
  }

  if(newScreen === BATTLE_SCREEN)
  {
    BACKGROUND = arenaBg;
    console.log("Resetting battle state");
    gameMaster.reset();
  }
  else if(newScreen === PRE_BATTLE_SCREEN)
  {
    BACKGROUND = preBattleBg;
    console.log("Reset pre battle menu");

    preBattleMenu.resetSelection(1);
  }
  else if(newScreen === LOADOUT_SCREEN)
  {
    BACKGROUND = preBattleBg;
    console.log("Update loadout options");
    loadouts.reset(PLAYER_LOADOUT);
  }
  else if(newScreen === GAME_END)
  {
    resetGame();
    BACKGROUND = arenaBg;
    endWindow.setEndState(END_STATE);
  }
  else
  {
    BACKGROUND = arenaBg;
  }
  
  activeScreen = newScreen;
}

function generateEnemyList()
{
  var enemyList = battleGenerator.generateBattle(BATTLE_COUNTER);

  NEXT_OPPONENT_LIST = enemyList;

  //console.log("NEXT_OPPONENT_LIST SET!");
  //console.log(NEXT_OPPONENT_LIST);
}

function buildScreens()
{
  var titleScreen = new Screen();
  screens.push(titleScreen);
  var preBattleScreen = new Screen();
  screens.push(preBattleScreen);
  var battleScreen = new Screen();
  battleScreen.ySort = true;
  screens.push(battleScreen);
  var loadoutScreen = new Screen();
  screens.push(loadoutScreen);
  var endScreen = new Screen();
  screens.push(endScreen);

  console.log(screens);
}

function loadTechAndWeapons()
{
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

    var newTech = new Technique(fullTechsList.techniques[i]);

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
}

function setupPlayer()
{
  var playerSprites = getCharacterAnims(shop.startingItems[0]);
  player.setSprites(playerSprites);
}

function resetGame()
{
  BATTLE_COUNTER = 0;
  loadTechAndWeapons();
  setupPlayer();
  player.reset();
  gameMaster.prepareEnemyList();
}

function setup() {
  // put setup code here
  console.log("Setup starting...");
  var canvas = createCanvas(1024, 768);
  canvas.parent('sketch-holder');

  this.buildScreens();

  this.endWindow = new GameEndScreen({x: width/2, y: height/2}, {w: width/2, h: height/2});

  var emperor = new Emperor(400, 1000);
  
  this.loadTechAndWeapons();  

  loadAtlas();

  player = new Player({x: 150, y: height/2 + 100}, 5000);
  this.setupPlayer();

  battleGenerator = new BattleGenerator();

  generateEnemyList();

  gameMaster = new GameMaster();
  gameMaster.setEmperor(emperor);
  gameMaster.addPlayer(player);

  var titles = new TitleScreen({ x: width / 2, y: height / 2 - 50 }, title);
  preBattleMenu = new PreBattleScreen({x: width/2, y: height/2 }, {w: width - 100, h: height - 100}, 1, shop, fullTechsList);
  loadouts = new LoadoutScreen({ x: width / 2, y: height /2 }, { w: width / 2, h: height / 2}, PLAYER_LOADOUT);

  console.log(PLAYER_LOADOUT);

  this.setActiveScreen(activeScreen);

  textSize(24);
  setKeys();
  console.log("Setup finished...");
}

function nextBattle()
{
  BATTLE_COUNTER ++;
  gameMaster.prepareEnemyList();
}

function getEnemyId()
{
  var thisId = enemyId;
  enemyId ++;

  return thisId;
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

function randomNum(from, to)
{
  return Math.floor((Math.random() * to) + from);
}

function getCharacterAnims(specificWeapon)
{
  var random = true;
  if(specificWeapon)
  {
    random = false;
  }

  head = randomNum(0, ANIMATIONS.HEADS.length);
  body = randomNum(0, ANIMATIONS.BODIES.length);

  if(random)
  {
    weapon = randomNum(0, ANIMATIONS.WEAPONS.length);
  }
  else
  {
    weapon = getWeaponAnimIndex(specificWeapon);
    //console.log(specificWeapon + " index: " + weapon);
  }

  var spriteList = [];

  spriteList.push(new Sprite(ANIMATIONS.HEADS[head].frames, 0.2, BATTLE_SCREEN, ANIMATIONS.HEADS[head].offset));
  spriteList.push(new Sprite(ANIMATIONS.BODIES[body].frames, 0.2, BATTLE_SCREEN, ANIMATIONS.BODIES[body].offset));
  spriteList.push(new Sprite(ANIMATIONS.WEAPONS[weapon].frames, 0.2, BATTLE_SCREEN, ANIMATIONS.WEAPONS[weapon].offset, "weapon"));

  return spriteList;
}

function getWeaponAnimIndex(weaponName)
{
  var index = -1;
  for(var i = 0; i < ANIMATIONS.WEAPONS.length && index < 0; i ++)
  {
    if(ANIMATIONS.WEAPONS[i].info === weaponName)
    {
      index = i;
    }
  }
  return index;
}

function loadAtlas()
{
  /*
  console.log("Load spritesheet");
  console.log(characterAtlasData);
  */
  ANIMATIONS = {};
  ANIMATIONS.HEADS = [];
  ANIMATIONS.BODIES = [];
  ANIMATIONS.WEAPONS = [];

  var frameDims = characterAtlasData.frameDims;
  var defs = characterAtlasData.definitions;

  for(var i = 0; i < defs.length; i ++)
  {
    /*
    console.log("Load row: ");
    console.log(defs[i]);
    */
    anim = {
      name: defs[i].name,
      frames: [],
      offset: { x: 0, y: 0 },
    }

    for(var frm = 0; frm < frameDims.animLength; frm ++)
    {
      var row = defs[i].row;
      anim.frames.push(characterAtlas.get(frm * frameDims.w, row * frameDims.h, frameDims.w, frameDims.h));
      if(defs[i].offset)
      {
        anim.offset = defs[i].offset;
      }
      if(defs[i].info)
      {
        anim.info = defs[i].info;
      }
    }

    if(anim.name.startsWith("head"))
    {
      ANIMATIONS.HEADS.push(anim);
    }
    else if(anim.name.startsWith("body"))
    {
      ANIMATIONS.BODIES.push(anim);
    }
    else if(anim.name.startsWith("weapon"))
    {
      ANIMATIONS.WEAPONS.push(anim);
    }
  }

  console.log(" === ATLAS LOADED === ");
  //console.log(ANIMATIONS);
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
  preBattleBg = loadImage("assets/sprites/preBattle.png");

  thumbsUp = loadImage("assets/sprites/thumbsUp.png");
  thumbsDown = loadImage("assets/sprites/thumbsDown.png");

  fullTechsList = loadJSON("assets/data/techniques.json");
  shop = loadJSON("assets/data/shop.json");

  characterAtlas = loadImage("assets/sprites/characterAtlas.png");
  characterAtlasData = loadJSON("assets/sprites/characterAtlas.json");

  playerSheetData = loadJSON("assets/sprites/playerSheet.json");
  playerSheet = loadImage("assets/sprites/playerSheet.png");
  
  LEVEL_DATA = loadJSON("assets/data/battles.json");

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
  else if(keyCode === menuBackButton && menuBackHeld === false)
  {
    menuBackHeld = true;
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
  else if(keyCode === menuBackButton && menuBackHeld === true)
  {
    menuBackHeld = false;
    screens[activeScreen].menuBack();
  }
}

function draw() {
  clear();
  textSize(18);
  imageMode(CORNER);
  background(BACKGROUND);
  
  screens[activeScreen].update(deltaTime/1000);
  screens[activeScreen].draw();
  screens[activeScreen].animate();
}