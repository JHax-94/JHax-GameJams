import EntityManager from './EntityManager.js'
import Battery from './Battery.js'
import Component from './Component.js'

var hasRunSetup = false;

var FPS = 1/60;
var TOTAL_SPRITES = 255;
var PIXEL_SCALE = 16;

var em;
var p2 = require('p2');

var CONSOLE_ON = true;

var componentTiles = [
    {
        type: "Battery",
        index: 0
    },
    {
        type: "Direction",
        index: 5
    }
]

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

    for(var i = 0; i < componentTiles.length; i ++)
    {
        var tilesOfType = map.find(componentTiles[i].index);
        
        for(var j = 0; j < tilesOfType.length; j ++)
        {
            var tile = tilesOfType[j];
            mapComponents.push({
                tileX: tile.x,
                tileY: tile.y,
                tileType: componentTiles[i].type,
                tileSprite: tile.sprite
            });
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

        //consoleLog(comp.component);

        if(comp.component) 
        {
            var component = new Component(
            {
                x: comp.tileX,
                y: comp.tileY
            },
            {
                index: comp.component.sprite,
                flipX: comp.component.flipX,
                flipY: comp.component.flipY,
                flipR: comp.component.flipR
            });
        }
        else if(comp.battery)
        {
            var battery = new Battery(
                {
                    x: comp.tileX,
                    y: comp.tileY,
                },
                comp.battery.charges,
                comp.battery.pulseTime,
                comp.battery.pulseSpeed
            );
        }
    }
}

function Setup()
{
    paper(1);

    var mapDefs = assets.mapDefs.mapDefs;

    //consoleLog(mapDefs);
    em = new EntityManager();

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

    
    em.Update(FPS);
    em.Render();
};

export { em, p2, consoleLog, TOTAL_SPRITES, PIXEL_SCALE };