import EntityManager from './EntityManager.js'
import Level from './Levels/Level.js';
import TileUtils from './TileUtils.js';
import UiBuilder from './UI/UiBuilder.js'
import { vec2 } from 'p2';
import TextureExtender from './TextureExtensions.js'
import VectorExtensions from './VectorExtensions.js'
import TriggerZoneEvents from './PhysicsEvents/TriggerZoneEvents.js';
import NpcEvents from './PhysicsEvents/NpcEvents.js';
import ImpEvents from './PhysicsEvents/ImpEvents.js';
import Utility from './Utility.js';
import AudioHelper from './AudioHelper.js';
import LevelGuide from './UI/LevelGuide.js';
import UiComponent from './UI/UiComponent.js';
import Label from './UI/Label.js';
import Rect from './UI/Rect.js';
import HighScoresStore from './HighScoresStore.js';

let p2 = require('p2');
let pixelbox = require("pixelbox");
let pointerEvents = require('pixelbox/pointerEvents');

let AUDIO = new AudioHelper();

let extender = new TextureExtender();
let vecExtender = new VectorExtensions();

let SCORES = new HighScoresStore();

let Texture = extender.ExtendTextureClass(require('pixelbox/Texture'));

let UTIL = new Utility();

vecExtender.ExtendVec2(vec2);

function getFont()
{
    return {
        name: "Default",
        charWidth: 4,
        charHeight: 5
    };
}

function setFont()
{

}

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

let VERSION = getVersionInformation();

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

let PIXEL_SCALE = getPixelScale();
let FPS = 1/60;
let TILE_WIDTH = getTileWidth();
let TILE_HEIGHT = getTileHeight();
let LOGGING_ON = true;

let TILE_UTILS = new TileUtils();

let LOAD_COMPLETE = false;
let EM = null;

let UI_BUILDER = new UiBuilder();

let COLLISION_GROUP ={
    PLAYER: Math.pow(2, 0),
    ELEVATOR: Math.pow(2, 1),
    NPC: Math.pow(2, 2),
    FLOOR: Math.pow(2, 3),
    NPC_INTERACTABLE: Math.pow(2, 4),
};

function getLevelData(levelName)
{
    consoleLog(`- Search for levelName: ${levelName}`);
    consoleLog(assets.levels.data);

    let levelData = null;

    for(let i = 0; i < assets.levels.data.length; i ++)
    {
        let lvl = assets.levels.data[i];

        consoleLog(`Check match: ${lvl.levelName} ?= ${levelName}`);

        if(lvl.levelName === levelName)
        {
            levelData = lvl;
            break;
        }
    }
    consoleLog(`- returning:`);
    consoleLog(levelData);

    return levelData;
}

function SETUP(levelName)
{
    consoleLog(`==== Loading Level: ${levelName} ====`);
    
    EM = new EntityManager();

    if(levelName)
    {
        let levelData = getLevelData(levelName);

        if(levelData)
        {
            let level = new Level(levelData);

            AddPhysicsEvents();
        }

        if(levelName === "LevelSelect")
        {
            let guide = new LevelGuide();

            let frame = EM.GetEntity("FRAME");

            frame.levelGuide = guide;



            new Label(
                { x: 8, y: 9.25 },
                "Employee Notice",
                {
                    posType: "CENTRE",
                    colours: {
                        font: 1
                    }
                });

            new Label(
                { x: 8, y: 9.75 },
                "Pilot elevators to take damned souls",
                {
                    posType: "CENTRE",
                    colours: { font: 1 }   
                });

            new Label(
                { x: 8, y: 10.25 },
                "to their designated workstations.",
                {
                    posType: "CENTRE",
                    colours: { font: 1 }   
                });
            
            new Label(
                { x: 8, y: 11 },
                "Doors must be open for souls",
                {
                    posType: "CENTRE",
                    colours: { font: 1 }
                });

            new Label(
                { x: 8, y: 11.5 },
                "to board and disembark.",
                {
                    posType: "CENTRE",
                    colours: { font: 1 }
                });

            new Label(
                { x: 8, y: 12.25 },
                "Souls that take too much time between",
                {
                    posType: "CENTRE",
                    colours: { font: 1 }   
                });
            
            new Label(
                { x: 8, y: 12.75 },
                "tasks will be obliterated!",
                {
                    posType: "CENTRE",
                    colours: { font: 1 }   
                });
        }
    }

    LOAD_COMPLETE = true;
}

let physEvents = [
    new TriggerZoneEvents(),
    new NpcEvents(),
    new ImpEvents()
];

function AddPhysicsEvents()
{
    for(let i = 0; i < physEvents.length; i ++)
    {
        physEvents[i].RegisterEvents();
    }
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {
    if(!LOAD_COMPLETE)
    {
        SETUP("LevelSelect");
        AUDIO.PlayMusic();
    }

    EM.Input();
    EM.Update(FPS);
    EM.Render();

    /*
    frameCount ++;

    paper(Math.ceil(frameCount / 10) % 16);
    rectf(0, 0, PIXEL_SCALE, PIXEL_SCALE);*/
};

export {
    p2, EM, SETUP, PIXEL_SCALE, FPS, TILE_WIDTH, TILE_HEIGHT, UI_BUILDER, TILE_UTILS, Texture, COLLISION_GROUP, UTIL, AUDIO, SCORES, getFont, setFont, consoleLog, getObjectConfig
};
