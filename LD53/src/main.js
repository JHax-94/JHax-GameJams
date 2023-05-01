import { vec2 } from 'p2';
import EntityManager from './EntityManager';
import TextureExtender from './TextureExtensions';
import VectorExtensions from './VectorExtensions';
import BeastEvents from './PhysEvents/BeastEvents';
import LevelMap from './LevelMap';
import Menu from './Menus/Menu';
import Utility from './Utility';
import PlayerEvents from './PhysEvents/PlayerEvents';
import SoundManager from './SoundManager';

let pixelbox = require('pixelbox');
let pointerEvents = require('pixelbox/pointerEvents');
let p2 = require('p2');

let UTIL = new Utility()

let SOUND = null;

let version = getVersionInformation();

let physEvents = [ new BeastEvents(), new PlayerEvents() ];
let COLLISION_GROUP = {
    PLAYER: Math.pow(2, 0),
    AURA: Math.pow(2, 1)
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

    console.log(pixelbox);

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

    if(!objectConf)
    {
        console.warn(`Failed to retrieve config for: ${objectName}`);
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

function mapMousePos(x, y)
{
    return { x: x, y: y };
}

pointerEvents.onPress(function(x, y, pointerId, evt) {
    var mapped = mapMousePos(x, y);
    EM.MouseClick(mapped.x, mapped.y, evt.button);
});

pointerEvents.onMove(function(x, y, pointerId, evt) {
    var mapped = mapMousePos(x, y);
    EM.MouseMove(mapped.x, mapped.y);
});

function getFontFromPath(fontPath)
{
    let fontRoot = assets.fonts;

    let path = fontPath.split('/');

    let layer = fontRoot;

    for(let i = 0; i < path.length; i ++)
    {
        let checkLayer = layer[path[i]];

        layer = checkLayer;
    }

    return layer;
}

function getFont(fontName)
{
    let fontMap = assets.fontConfig.map;

    let font = null;

    if(!fontName)
    {
        fontName = "Default";
    }

    for(let i = 0; i < fontMap.length; i ++)
    {
        let fm = fontMap[i];

        if(fm.name === fontName)
        {
            let fontObj = Object.assign({}, fm);

            if(fontObj.path)
            {
                fontObj.img = getFontFromPath(fontObj.path);
            }

            font = fontObj;
        }
    }

    return font;
}

function setFont(fontImage)
{
    /*consoleLog("Set Font:");
    consoleLog(fontImage);*/

    if(fontImage && fontImage.img)
    {
        setCharset(fontImage.img);
    }
    else
    {
        setCharset(fontImage);
    }
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

function playFx(effectName)
{
    if(assets.bleeper[effectName])
    {
        assets.bleeper[effectName].play();
    }
}

function SETUP(levelName)
{
    let newEm = new EntityManager();
    
    EM = newEm;

    let levelData = GetLevelDataByName(levelName);
    
    if(levelData)
    {
        if(levelData.levelType === "Map")
        {
            AddPhysicsEvents();
            new LevelMap(levelData);
        }
        else if(levelData.levelType === "Menu")
        {
            consoleLog("Menu Level Data Found:");
            consoleLog(levelData);
            let config = getObjectConfig(levelData.menuConfig);
            new Menu(config);
        }
    }

    if(!SOUND)
    {
        SOUND = new SoundManager({x:0, y: 0});
        SOUND.Start();
    }
    else
    {
        SOUND.Reregister();
    }

    LOAD_COMPLETE = true;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {
	if(!LOAD_COMPLETE)
    {
        SETUP("MainMenu");
    }

    EM.Input();
    EM.Update(FPS);
    EM.Render();
};

export {
    consoleLog, p2, Texture, EM, SETUP, PIXEL_SCALE, FPS, COLLISION_GROUP, TILE_WIDTH, TILE_HEIGHT, getObjectConfig, getObjectConfigByProperty, formatToFixed,
    getFont, setFont, UTIL, playFx
}
