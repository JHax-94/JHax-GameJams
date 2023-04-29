import { vec2 } from 'p2';
import EntityManager from './EntityManager';
import TextureExtender from './TextureExtensions';
import VectorExtensions from './VectorExtensions';
import Player from './Characters/Player';
import BeastEvents from './PhysEvents/BeastEvents';
import Village from './Villages/Village';
import LevelMap from './LevelMap';

let pixelbox = require('pixelbox');
let p2 = require('p2');

let version = getVersionInformation();

let physEvents = [ new BeastEvents() ];
let COLLISION_GROUP = {
    PLAYER: Math.pow(2, 0)
};

function getVersionInformation()
{
    let verInfo = document.getElementById("version-info");

    let ver = verInfo.attributes["version"].value;
    let git = verInfo.attributes["git"].value;

    console.log("Building version info:");
    console.log(verInfo);
    console.log(ver);
    console.log(git);

    return {
        version: ver,
        git: git
    };
}

function getPixelScale()
{
    return pixelbox.settings.tileSize.width;
}

function getTileWidth()
{
    return pixelbox.settings.screen.width / PIXEL_SCALE;
}

function getTileHeight()
{
    return pixelbox.settings.screen.height / PIXEL_SCALE;
}

function consoleLog(logData)
{
    if(LOGGING_ON) console.log(logData);
}

function getObjectConfig(objectName, copyObj)
{
    let objectMap = assets.objectConfig.objectMap;
    let objectConf = null;

    for(let i = 0; i < objectMap.length; i ++)
    {
        if(objectMap[i].name === objectName)
        {
            objectConf = objectMap[i];
            break;
        }
    }

    return copyObj ? Object.assign({}, objectConf) : objectConf;
}

function getObjectConfigByProperty(propKey, propValue, copyObj)
{
    let objectMap = assets.objectConfig.objectMap;
    let objectConf = null;

    for(let i = 0; i < objectMap.length; i ++)
    {
        if(objectMap[i][propKey] === propValue)
        {
            objectConf = objectMap[i];
            break;
        }
    }

    return copyObj ? Object.assign({}, objectConf) : objectConf;
}

function GetLevelDataByName(levelName)
{
    let levelData = null;

    consoleLog(`Find level: ${levelName}`);
    consoleLog("In List:");
    consoleLog(assets.levels.data);

    for(let i = 0; i < assets.levels.data.length; i ++)
    {
        if(assets.levels.data[i].levelName === levelName)
        {
            levelData = assets.levels.data[i];
        }    
    }

    return levelData;
}

function AddPhysicsEvents()
{
    /*consoleLog("ADD PHYS EVENTS");
    consoleLog(physEvents);*/
    for(let i = 0; i < physEvents.length; i ++)
    {
        physEvents[i].RegisterEvents();
    }
}

function formatToFixed(num, dp)
{
    return +parseFloat(num).toFixed(dp);
}

let PIXEL_SCALE = getPixelScale();
let TILE_WIDTH = getTileWidth();
let TILE_HEIGHT = getTileHeight();

let texExtend = new TextureExtender();
let vecExtend = new VectorExtensions();

let Texture = texExtend.ExtendTextureClass(require('pixelbox/Texture'));
vecExtend.ExtendVec2(vec2)

let FPS = 1/60;

let LOGGING_ON = true;

let LOAD_COMPLETE = false;
let EM;



function SETUP(levelName)
{
    let newEm = new EntityManager();
    
    EM = newEm;

    let levelData = GetLevelDataByName(levelName);
    /*
    consoleLog("Construct player...");
    let player = new Player();

    AddPhysicsEvents();

    for(let i = 0; i < 3; i ++)
    {
        let start = {
            x: 4 + i,
            y: 4 + i
        };

        let critter = new WhistleBeast(start);
    }
    
    let village = new Village({ x: TILE_WIDTH - 4, y: TILE_HEIGHT - 4 });

    village.AddRequest([ 
        {
            beastType: "WHISTLE",
            quantity: 3
        }   
    ]);

    EM.AddEntity("Player", player);
    */
    consoleLog("Level Data:");
    consoleLog(levelData);

    if(levelData)
    {
        AddPhysicsEvents();
        new LevelMap(levelData);
    }

    LOAD_COMPLETE = true;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {
	if(!LOAD_COMPLETE)
    {
        SETUP("WhistleTutorial");
    }

    EM.Input();
    EM.Update(FPS);
    EM.Render();
};

export {
    consoleLog, p2, Texture, EM, SETUP, PIXEL_SCALE, FPS, COLLISION_GROUP, TILE_WIDTH, TILE_HEIGHT, getObjectConfig, getObjectConfigByProperty, formatToFixed
}
