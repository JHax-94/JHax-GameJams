import EntityManager from './EntityManager.js'
import Level from './Levels/Level.js';
import UiBuilder from './UI/UiBuilder.js'

let p2 = require('p2');
let pixelbox = require("pixelbox");
let pointerEvents = require('pixelbox/pointerEvents');

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

let LOAD_COMPLETE = false;
let EM = null;

let UI_BUILDER = new UiBuilder();

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
        }
    }

    LOAD_COMPLETE = true;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {
    if(!LOAD_COMPLETE)
    {
        SETUP("Test");
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
    p2, EM, SETUP, PIXEL_SCALE, FPS, TILE_WIDTH, TILE_HEIGHT, UI_BUILDER, consoleLog
};
