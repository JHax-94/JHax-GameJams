import EntityManager from './EntityManager.js'
import Battery from './Battery.js'
import Component from './Component.js'
import RailPoint from './RailPoint.js';
import DirectionSwitcher from './DirectionSwitcher.js';
import Selector from './Selector.js';
import Bulb from './Bulb.js';

var pointerEvents = require('pixelbox/pointerEvents');
var p2 = require('p2');

var UP = 0;
var RIGHT = 1;
var DOWN = 2;
var LEFT = 3;

var hasRunSetup = false;

var FPS = 1/60;
var TOTAL_SPRITES = 255;
var PIXEL_SCALE = 16;

var em;

var CONSOLE_ON = true;

var arrowDirMap = [
    { dir: UP, flipX: false, flipY: false, flipR: false },
    { dir: RIGHT, flipX: false, flipY: false, flipR: true },
    { dir: DOWN, flipX: false, flipY: true, flipR: false },
    { dir: LEFT, flipX: true, flipY: false, flipR: true }
];

var cornerDirMap = [
    { dir: "RD", flipX: false, flipY: false, flipR: false },
    { dir: "RU", flipX: false, flipY: true, flipR: false },
    { dir: "LD", flipX: true, flipY: false, flipR: false },
    { dir: "LU", flipX: true, flipY: false, flipR: true },
    { dir: "LU", flipX: true, flipY: true, flipR: false }
];

var componentTiles = [
    {
        type: "Battery",
        index: 0
    },
    {
        type: "Direction",
        index: 5
    },
    {
        type: "Corner",
        index: 2
    },
    {
        type: "Bulb",
        index: 16
    },
];

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

    var def = null;

    for(var i = 0; i < mapDefs.length; i ++)
    {
        if(mapDefs[i].name === mapName)
        {
            def = mapDefs[i];
        }
    }

    return def;
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
                    tileType: componentTiles[i].type,
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
    
    consoleLog("=== ADDITIONAL MAP DEF ===");
    consoleLog(mapDef);
    consoleLog("==========================");
    for(var i = 0; i < mapDef.components.length; i ++)
    {
        var comp = mapDef.components[i];

        //consoleLog(comp);

        if(comp.component) 
        {
            var pos = { x: comp.tileX, y: comp.tileY };

            var spriteInfo = 
            {
                index: comp.component.sprite,
                flipX: comp.component.flipX,
                flipY: comp.component.flipY,
                flipR: comp.component.flipR
            };
            
            if(comp.tileType === "Direction")
            {
                //consoleLog("NEW COMPONENT");
                var component = new DirectionSwitcher(
                    pos,
                    spriteInfo,
                    comp.isControllable);
            }
            else if(comp.tileType === "Bulb")
            {
                var comp = new Bulb(pos, spriteInfo, comp.bulb);
            }
            else if(comp.tileType === "Battery")
            {
                var battery = new Battery(
                    pos,
                    spriteInfo,
                    comp.battery.charges,
                    comp.battery.pulseTime,
                    comp.battery.pulseSpeed
                );
            }
        }
        else if(comp.battery)
        {
            //consoleLog("New Battery!");
            
        }
    }

    for(var i = 0; i < points.length; i ++)
    {
        /*consoleLog("Corner tile!");
        consoleLog(points[i]);*/

        new RailPoint({ x: points[i].x, y: points[i].y }, GetDirMapFromFlips(points[i].flipH, points[i].flipV, points[i].flipR));
    }
}

pointerEvents.onPress(function(x, y, pointerId, evt) {
    em.MouseClick(x, y);
});

function Setup()
{
    paper(1);

    var mapDefs = assets.mapDefs.mapDefs;

    //consoleLog(mapDefs);
    em = new EntityManager();
    em.selector = new Selector(20);    

    LoadMap('map');

    //var testBox = new Battery({x: 0, y: 0}, 1);    

    hasRunSetup = true;
}

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

export { em, p2, consoleLog, GetArrowDirMapFromDir, GetArrowDirMapFromFlips, TOTAL_SPRITES, PIXEL_SCALE, UP, RIGHT, DOWN, LEFT };
