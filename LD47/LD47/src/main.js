import EntityManager from './EntityManager.js';
import Battery from './Battery.js';
import Button from './Button.js';
import RailPoint from './RailPoint.js';
import DirectionSwitcher from './DirectionSwitcher.js';
import Selector from './Selector.js';
import Bulb from './Bulb.js';
import Label from './Label.js';
import AltSwitch from './AltSwitch.js';
import Transistor from './Transistor.js';
import WireSwitch from './WireSwitch.js';
import Diode from './Diode.js';
import SoundSettings from './SoundSettings.js';
import Menu from './Menu.js';

var pointerEvents = require('pixelbox/pointerEvents');
var p2 = require('p2');

var GAME_SIZE_SCALE = 1;

var SIZE_SMALL = 0;
var SIZE_MEDIUM = 1;
var SIZE_LARGE = 2;

var CURRENT_PAGE = 0;

var GAME_SIZE = SIZE_LARGE;

var SPEED_SLOW = 0.5;
var SPEED_NORMAL = 1;
var SPEED_FAST = 2;

var gameSpeeds = [
    { name: "Slow", speed: SPEED_SLOW },
    { name: "Normal", speed: SPEED_NORMAL },
    { name: "Fast", speed: SPEED_FAST }
]

var GAME_SPEED = 1;

var sizeMaps = [
    { name: "Small", windowDims: 512, mouseScale: 2 },
    { name: "Medium", windowDims: 768, mouseScale: 4/3 },
    { name: "Large", windowDims: 1024, mouseScale: 1 }
]

function getGameSpeed()
{
    return gameSpeeds[GAME_SPEED];
}

function getGameSize()
{
    return sizeMaps[GAME_SIZE];
}


var COLOURS;
var SFX;

var soundPos = { tileX: 0.25, tileY: 0.25 };

var SOUND;

var VOL = 0;

var UP = 0;
var RIGHT = 1;
var DOWN = 2;
var LEFT = 3;

var HOVER_SPRITE = 36;

var hasRunSetup = false;

var CURRENT_LVL = "";
var FPS = 1/60;
var TOTAL_SPRITES = 255;
var PIXEL_SCALE = 16;

var em;

var CONSOLE_ON = true;

var diodeDirMap = [
    { dir: UP, flipX: true, flipY: false, flipR: true },
    { dir: UP, flipX: false, flipY: false, flipR: true },
    { dir: RIGHT, flipX: true, flipY: false, flipR: false },
    { dir: RIGHT, flipX: true, flipY: true, flipR: false },
    { dir: DOWN, flipX: true, flipY: true, flipR: true },
    { dir: DOWN, flipX: false, flipY: true, flipR: true },
    { dir: LEFT, flipX: false, flipY: false, flipR: false },
    { dir: LEFT, flipX: false, flipY: true, flipR: false },
];

var wireSwitchMap = [
    { dir: "H", flipX: false, flipY: false, flipR: false },
    { dir: "V", flipX: false, flipY: false, flipR: true }
];

var altSwitchDirMap = [
    { name: "LD", dir: "LD", setDir: LEFT, flipX: true, flipY: false, flipR: true },
    { name: "DL", dir: "DL", setDir: DOWN, flipX: true, flipY: true, flipR: false },
    { name: "UR", dir: "UR", setDir: UP, flipX: false, flipY: false, flipR: false },
    { name: "UL", dir: "UL", setDir: UP, flipX: true, flipY: false, flipR: false },
    { name: "DR", dir: "DR", setDir: DOWN, flipX: false, flipY: true, flipR: false },
    { name: "RD", dir: "RD", setDir: LEFT, flipX: false, flipY: false, flipR: true },
    { name: "RU", dir: "RU", setDir: LEFT, flipX: false, flipY: true, flipR: true },
    { name: "LU", dir: "LU", setDir: LEFT, flipX: true, flipY: true, flipR: true },
    { name: "RL", dir: "RL", setDir: RIGHT, flipX: false, flipY: false, flipR: true },
    { name: "LR", dir: "LR", setDir: LEFT, flipX: true, flipY: true, flipR: true },
    { name: "UD", dir: "UD", setDir: UP, flipX: false, flipY: false, flipR: false },
    { name: "DU", dir: "DU", setDir: DOWN, flipX: true, flipY: true, flipR: false } 
];

var arrowDirMap = [
    { name: "UP", dir: UP, flipX: false, flipY: false, flipR: false },
    { name: "RIGHT", dir: RIGHT, flipX: false, flipY: false, flipR: true },
    { name: "DOWN", dir: DOWN, flipX: false, flipY: true, flipR: false },
    { name: "LEFT", dir: LEFT, flipX: true, flipY: false, flipR: true }
];

var cornerDirMap = [
    { dir: "RD", flipX: false, flipY: false, flipR: false },
    { dir: "RU", flipX: false, flipY: true, flipR: false },
    { dir: "RU", flipX: false, flipY: false, flipR: true },
    { dir: "LD", flipX: true, flipY: false, flipR: false },
    { dir: "LD", flipX: true, flipY: true, flipR: true },
    { dir: "LU", flipX: true, flipY: false, flipR: true },
    { dir: "LU", flipX: true, flipY: true, flipR: false },
];

var validAdjacentTiles = [
    { spriteId: 0 },
    { spriteId: 1 },
    { spriteId: 2 },
    { spriteId: 3 },
    { spriteId: 4 },
    { spriteId: 5 },
    { spriteId: 9 },
    { spriteId: 16 },
    { spriteId: 23 },
    { spriteId: 24 },
    { spriteId: 32 },
    { spriteId: 33 }
];

var componentTiles = [
    {
        type: "Battery",
        index: 0
    },
    {
        type: "Direction",
        index: 5,
        replaceSprite: 6
    },
    {
        type: "AltSwitch",
        index: 9
    },
    {
        type: "Corner",
        index: 2
    },
    {
        type: "Bulb",
        index: 16
    },
    {
        type: "Switch",
        index: 23,
        replaceSprite: 39
    },
    {
        type: "Diode",
        index:33  
    },
    {
        type: "Transistor",
        index: 32
    }
];

function GetDiodeDirMapFromFlips(flipX, flipY, flipR)
{
    var dirMap = null;

    for(var i = 0; i < diodeDirMap.length; i ++)
    {
        if(diodeDirMap[i].flipX === flipX && diodeDirMap[i].flipY === flipY && diodeDirMap[i].flipR === flipR)
        {
            dirMap = diodeDirMap[i];
            break;
        }
    }

    if(dirMap === null)
    {
        console.log("DIODE: Flips - X:" + flipX + ", Y: " + flipY + ", R: " + flipR);
        console.log(dirMap);
    }

    return dirMap;
}

function GetWireSwitchDirFromDir(dir)
{
    var dirMap = null;

    for(var i = 0; i < wireSwitchMap.length; i ++)
    {
        if(wireSwitchMap[i].dir === dir)
        {
            dirMap = wireSwitchMap[i];
            break;
        }
    }

    return dirMap;
}

function GetWireSwitchDirFromFlips(flipX, flipY, flipR)
{
    var dirMap = null;

    for(var i = 0; i < wireSwitchMap.length; i ++)
    {
        if(wireSwitchMap[i].flipX === flipX && wireSwitchMap[i].flipY === flipY && wireSwitchMap[i].flipR === flipR)
        {
            dirMap = wireSwitchMap[i];
            break;
        }
    }

    return dirMap;
}

function GetAltSwitchDirMapFromDir(dir) 
{   
    var dirMap = null;

    for(var i = 0; i < altSwitchDirMap.length; i ++)
    {
        if(altSwitchDirMap[i].dir === dir)
        {
            dirMap = altSwitchDirMap[i];
            break;
        }
    }

    return dirMap;
}

function GetAltSwitchDirMapFromFlips(flipX, flipY, flipR)
{
    var dirMap = null;

    for(var i = 0; i < altSwitchDirMap.length; i ++)
    {
        if(altSwitchDirMap[i].flipX === flipX && altSwitchDirMap[i].flipY === flipY && altSwitchDirMap[i].flipR === flipR)
        {
            dirMap = arrowDirMap[i];
            break;
        }
    }

    return dirMap;
}

function GetArrowDirMapFromFlips(flipX, flipY, flipR)
{
    var dirMap = null;

    for(var i = 0; i < arrowDirMap.length; i ++)
    {
        if(arrowDirMap[i].flipX === flipX && arrowDirMap[i].flipY === flipY && arrowDirMap[i].flipR === flipR)
        {
            dirMap = arrowDirMap[i];
            break;
        }
    }

    console.log("Flips - X:" + flipX + ", Y: " + flipY + ", R: " + flipR);
    console.log(dirMap);

    return dirMap;
}

function GetArrowDirMapFromDir(dir)
{
    var dirMap = null;

    for(var i = 0; i < arrowDirMap.length; i ++)
    {
        if(arrowDirMap[i].dir === dir)
        {
            dirMap = arrowDirMap[i];
            break;
        }
    }

    return dirMap;
}

function GetArrowDirMapFromName(name)
{
    var dirMap = null;

    for(var i = 0; i < arrowDirMap.length; i ++)
    {
        if(arrowDirMap[i].name === name)
        {
            dirMap = arrowDirMap[i];
            break;
        }
    }

    return dirMap;
}

function GetDirMapFromFlips(flipX, flipY, flipR)
{
    /*
    consoleLog("GET DIR MAP: X: " + flipX + ", Y:" + flipY + ", R: " + flipR);
    consoleLog(cornerDirMap);
    */
    var dirMap = null;

    for(var i = 0; i < cornerDirMap.length; i ++)
    {
        var cdMap = cornerDirMap[i];
        if(cdMap.flipX === flipX && cdMap.flipY === flipY && cdMap.flipR === flipR)
        {
            dirMap = cdMap;
            break;
        }
    }
    if(dirMap===null)
    {
        consoleLog("DIR MAP NOT FOUND!");
        consoleLog("GET DIR MAP: X: " + flipX + ", Y:" + flipY + ", R: " + flipR);
    }

    return dirMap;
}

function GetDirMapFromDir(dir)
{
    var dirMap = null;

    for(var i = 0; i < cornerDirMap.length; i ++)
    {
        if(cornerDirMap[i].dir === dir)
        {
            dirMap = cornerDirMap[i];
            break;
        }
    }

    return dirMap;
}

function GetCornerTileType()
{
    var tileType = 0;

    for(var i = 0; i < componentTiles.length; i ++)
    {
        if(componentTiles[i].type === "Corner")
        {
            tileType = componentTiles[i].index;
            break;
        }
    }

    return tileType;
}

function consoleLog(obj)
{
    if(CONSOLE_ON)
    {
        console.log(obj);
    }
}

function GetMapDefs(mapName)
{
    var mapDefs = assets.mapDefs.mapDefs;

    consoleLog("GET MAP: " + mapName);
    consoleLog(mapDefs);

    var def = null;

    for(var i = 0; i < mapDefs.length; i ++)
    {
        if(mapDefs[i].name === mapName)
        {
            def = mapDefs[i];
            break;
        }
    }

    return def;
}

function getAnimation(animName)
{
    var anims = assets.animations.anims;
    var anim = null;

    for(var i = 0; i < anims.length; i ++)
    {
        if(anims[i].name === animName)
        {
            anim = anims[i];
            break;
        }
    }

    return anim;
}

function ToggleGameSpeed()
{
    GAME_SPEED = (GAME_SPEED + 1) % gameSpeeds.length;
    LoadLevel("title", true);
}

function ToggleGameSize()
{
    SetGameSize((GAME_SIZE + 1) % sizeMaps.length);
    LoadLevel("title", true);
}

function IsTileValid(tile)
{
    var valid = false;

    for(var i = 0; i < validAdjacentTiles.length; i ++)
    {
        if(validAdjacentTiles[i].spriteId === tile.sprite)
        {
            valid = true;
            break;
        }
    }

    return valid;
}

function GetValidAdjacentTiles(map, tilePos)
{
    var validTiles = [];
    var coords = [];

    consoleLog(tilePos);

    consoleLog("GETTING ADJACENT TILES");

    coords.push({ x: tilePos.x, y: tilePos.y - 1, dir: UP });
    coords.push({ x: tilePos.x + 1, y: tilePos.y, dir: RIGHT });
    coords.push({ x: tilePos.x, y: tilePos.y + 1, dir: DOWN });
    coords.push({ x: tilePos.x - 1, y: tilePos.y, dir: LEFT });

    for( var i = 0; i < coords.length; i ++)
    {
        var tile = map.get(coords[i].x, coords[i].y);

        if(tile !== null)
        {
            consoleLog("Adjacent Tile:");
            consoleLog(tile);

            if(IsTileValid(tile))
            {
                validTiles.push({ dir: coords[i].dir });
            }
        }
    }

    return validTiles;
}

function LoadMap(mapName)
{   
    var map = getMap(mapName);
    var mapComponents = [];
    var points = [];

    var cornerType = GetCornerTileType();

    /*
    consoleLog("Find tiles...");
    consoleLog(componentTiles);*/

    for(var i = 0; i < componentTiles.length; i ++)
    {
        //consoleLog("find tiles with index: " + componentTiles[i].index);
        var tilesOfType = map.find(componentTiles[i].index);
        //console.log(tilesOfType);

        /*
        var replaceSprite = componentTiles[i].replaceSprite != null;
        var replaceWith = 0;

        if(replaceSprite)
        {
            replaceWith = componentTiles[i].replaceSprite;
        }*/

        for(var j = 0; j < tilesOfType.length; j ++)
        {
            var tile = tilesOfType[j];

            if(componentTiles[i].index === cornerType)
            {
                points.push(tile);
            }
            else
            {
                mapComponents.push({
                    tileX: tile.x,
                    tileY: tile.y,
                    type: componentTiles[i].type,
                    tileSprite: tile.sprite,
                    tileData: tile
                });
            }
        }
    }

    em.map = map;

    consoleLog("=== MAP DEFINITIONS ===");
    consoleLog(JSON.stringify(mapComponents));
    consoleLog("=======================");

    var mapDef = GetMapDefs(mapName);
    
    if(mapDef.electronLossThreshold)
    {
        em.electronLossThreshold = mapDef.electronLossThreshold;
    }

    consoleLog("=== ADDITIONAL MAP DEF ===");
    consoleLog(mapDef);
    consoleLog("==========================");

    var addedComponents = [];

    for(var i = 0; i < mapDef.components.length; i ++)
    {
        var comp = mapDef.components[i];

        //consoleLog(comp);

        if(comp.tileData) 
        {
            var pos = { x: comp.tileX, y: comp.tileY };

            var spriteInfo = 
            {
                index: comp.tileSprite,
                flipX: comp.tileData.flipH,
                flipY: comp.tileData.flipV,
                flipR: comp.tileData.flipR
            };

            var newComp = null;
            
            if(comp.type === "Direction")
            {
                consoleLog("NEW DIRECTION SWITCHER");

                var adjacentTiles = GetValidAdjacentTiles(map, pos);

                newComp = new DirectionSwitcher(
                    pos,
                    spriteInfo,
                    comp.direction,
                    adjacentTiles);
            }
            else if(comp.type === "Bulb")
            {
                newComp = new Bulb(pos, spriteInfo, comp.bulb);
            }
            else if(comp.type === "Battery")
            {
                newComp = new Battery(
                    pos,
                    spriteInfo,
                    comp.battery.charges,
                    comp.battery.pulseTime,
                    comp.battery.pulseSpeed
                );
            }
            else if(comp.type === "AltSwitch")
            {
                newComp = new AltSwitch(pos, spriteInfo, comp.altSwitch);
            }
            else if(comp.type === "Switch")
            {
                consoleLog("Add wire Switch");
                newComp = new WireSwitch(pos, spriteInfo, comp.wireSwitch);
            }
            else if(comp.type === "Diode")
            {
                consoleLog("Add diode");
                newComp = new Diode(pos, spriteInfo);
            }
            else if(comp.type === "Transistor") 
            {
                consoleLog("Add transistor");
                consoleLog("Added components:");
                consoleLog(addedComponents);
                comp.transistor.connections = [];
                for(var i = 0; i < addedComponents.length; i ++)
                {
                    if(addedComponents[i].src.transistorId === comp.transistor.transistorId)
                    {
                        comp.transistor.connections.push(addedComponents[i].obj);
                    }
                }

                newComp = new Transistor(pos, spriteInfo, comp.transistor);
            }

            addedComponents.push({ src: comp, obj: newComp });
        }
        else if(comp.type === "Label")
        {
            var label = new Label(comp.position, comp.text, comp.colour);
        }
        else if(comp.type === "Button")
        {
            consoleLog("ADD BUTTON");
            var options = {};
            
            if(comp.btn_type)
            {
                options.type = comp.btn_type;
            }   
            else 
            {
                options.value = comp.value;
                options.type = "LVL";
            }

            var button = new Button(comp.tileRect, comp.text, options, comp.colours);

            if(em.menu !== null && options.type === "LVL")
            {
                consoleLog("ADD BUTTON TO MENU");
                em.menu.AddButton(button);
            }
        }
        else if(comp.type === "Menu")
        {
            consoleLog("ADD MENU");
            em.menu = new Menu(
                comp.position, 
                comp.pageLength, 
                comp.buttonOptions,
                comp.pagesLabel,
                comp.prevButton,
                comp.nextButton);
        }        
        
    }

    for(var i = 0; i < points.length; i ++)
    {
        /*consoleLog("Corner tile!");
        consoleLog(points[i]);*/

        new RailPoint({ x: points[i].x, y: points[i].y }, GetDirMapFromFlips(points[i].flipH, points[i].flipV, points[i].flipR));
    }
}

function mapMousePos(x, y)
{
    return { x: x * GAME_SIZE_SCALE, y: y * GAME_SIZE_SCALE };
}

pointerEvents.onPress(function(x, y, pointerId, evt) {
    var mapped = mapMousePos(x, y);
    em.MouseClick(mapped.x, mapped.y, evt.button);
});

pointerEvents.onMove(function(x, y, pointerId, evt) {
    var mapped = mapMousePos(x, y);
    em.MouseMove(mapped.x, mapped.y);
});


function SetGameSize(size)
{
    GAME_SIZE = size;
    var canvas = document.getElementsByTagName("canvas")[0];
    canvas.style.width = sizeMaps[size].windowDims;
    canvas.style.height = sizeMaps[size].windowDims;

    GAME_SIZE_SCALE = sizeMaps[size].mouseScale;
}

function LoadLevel(levelName, force)
{
    if(CURRENT_LVL !== levelName || force)
    {
        if(em)
        {
            if(em.menu !== null)
            {
                CURRENT_PAGE = em.menu.currentPage;
            }
        } 

        if(levelName === "title")
        {
            SOUND.PlayTitle();
        }
        else
        {
            SOUND.PlayRandomSong();
        }

        CURRENT_LVL = levelName;
        consoleLog("LOADING: " + levelName);
        em = new EntityManager();
        em.Initialise();
        em.selector = new Selector(20);

        LoadMap(levelName);

        if(em.menu !== null)
        {
            em.menu.OpenPage(CURRENT_PAGE);
        }
    }
}

function Setup()
{
    paper(1);   
    
    COLOURS = assets.colourMap;
    SFX = assets.soundMap;
    SOUND = new SoundSettings(soundPos, { speakerIndex: 13, speakerOffIndex: 14, speakerOnIndex: 15 });

    LoadLevel("title");

    //var testBox = new Battery({x: 0, y: 0}, 1);    

    hasRunSetup = true;

    SOUND.PlaySong("bgm1");
}

function GetDirectionFromString(directionString)
{
    var dir = 0;

    if(directionString === "UP") dir = UP;
    else if(directionString === "DOWN") dir = DOWN;
    else if(directionString === "RIGHT") dir = RIGHT;
    else if(directionString === "LEFT") dir = LEFT;

    return dir;
}

function BackToMenu()
{
    LoadLevel("title");
}

/*
window.addEventListener("keydown", function (evt) {
    if (evt.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

    if(evt.key === "Escape")
    {
        console.log("Return to menu...");
        BackToMenu();
    }
  
    evt.preventDefault();
  }, true);
*/
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {
    if(!hasRunSetup)
    {
        Setup();
    }

    em.Input();
    em.Update(FPS);
    em.Render();
};

export { 
    em, 
    p2, 
    consoleLog, 
    GetArrowDirMapFromDir, 
    GetArrowDirMapFromFlips, 
    GetArrowDirMapFromName, 
    LoadLevel, 
    GetAltSwitchDirMapFromDir, 
    GetDirectionFromString,
    GetWireSwitchDirFromFlips, 
    GetWireSwitchDirFromDir,
    GetDiodeDirMapFromFlips,
    ToggleGameSize,
    ToggleGameSpeed,
    getGameSpeed,
    getGameSize,
    getAnimation,
    HOVER_SPRITE,
    CURRENT_LVL, 
    TOTAL_SPRITES, 
    PIXEL_SCALE, 
    UP, 
    RIGHT, 
    DOWN, 
    LEFT, 
    COLOURS,
    SFX,
    VOL,
    SOUND
};
