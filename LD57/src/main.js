import GameWorld from "./GameWorld/GameWorld";
import EntityManager from "./EntityManager";
import TextureExtender from "./TextureExtensions";
import VectorExtensions from "./VectorExtensions";
import Utility from './Utility';
import { vec2 } from 'p2'
import CameraController from "./GameWorld/CameraController";
import SpacecraftPhysEventRegister from "./PhysEvents/SpacecraftPhysEvents";

let p2 = require('p2');
let pixelbox = require("pixelbox");
let pointerEvents = require('pixelbox/pointerEvents');

let extender = new TextureExtender();
let vecExtender = new VectorExtensions();

let Texture = extender.ExtendTextureClass(require('pixelbox/Texture'));

let UTIL = new Utility();

vecExtender.ExtendVec2(vec2);

let PIXEL_SCALE = getPixelScale();
let FPS = 1/60;
let TILE_WIDTH = getTileWidth();
let TILE_HEIGHT = getTileHeight();
let LOGGING_ON = true;
let LOAD_COMPLETE = false;
let EM = null;

let physEvents = [
    new SpacecraftPhysEventRegister()
];

let COLLISION_GROUP = {
    STATIONS: Math.pow(2, 0),
    SPACECRAFT: Math.pow(2, 1)
};

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

function consoleLog(logData) {
    if(LOGGING_ON) console.log(logData); 
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

function mapMousePos(x, y)
{
    return { x: x, y: y };
}

document.addEventListener('keydown', function(evt) 
{
    EM.UpdateKeyboardState(evt.key, true);
});

document.addEventListener('keyup', function(evt)
{
    EM.UpdateKeyboardState(evt.key, false);
});


pointerEvents.onPress(function(x, y, pointerId, evt) 
{
    let mapped = mapMousePos(x, y);
    let consumed = EM.MouseClick(mapped.x, mapped.y, evt.button);

    if(!consumed)
    {
        EM.UpdateKeyboardState(`m_${evt.button}`, true);
    }
});

pointerEvents.onRelease(function(x, y, pointerID, evt)
{    
    EM.UpdateKeyboardState(`m_${evt.button}`, false);
});

pointerEvents.onMove(function(x, y, pointerId, evt) 
{
    let mapped = mapMousePos(x, y);
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
    if(typeof fontImage === "string")
    {
        fontImage = getFont(fontImage);
    }

    if(fontImage)
    {
        if(fontImage && fontImage.img)
        {
            $screen.setCharset(fontImage.img);
        }
        else
        {
            if(fontImage.name === "Default")
            {
                $screen.setCharset(null);
            }
            else
            {
                $screen.setCharset(fontImage);
            }
        }
    }
}


function AddPhysicsEvents()
{
    for(let i = 0; i < physEvents.length; i ++)
    {
        physEvents[i].RegisterEvents();
    }
}

function SETUP()
{
    EM = new EntityManager();
    AddPhysicsEvents();
    let gameWorld = new GameWorld();
    EM.AddEntity("GAME_WORLD", gameWorld);
    let cameraControl = new CameraController();

    gameWorld.SetupGameWorld();

    LOAD_COMPLETE = true;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {
    if (!LOAD_COMPLETE)
    {
        SETUP();
    }

    EM.Input();
    EM.Update(FPS);
    EM.Render();
};


export {
    p2, EM, SETUP, PIXEL_SCALE, FPS, TILE_WIDTH, TILE_HEIGHT, UTIL, COLLISION_GROUP, getFont, setFont, consoleLog, getObjectConfig
};