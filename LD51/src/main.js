import EntityManager from './EntityManager.js'
import FlowManager from './FlowManager.js';
import Utility from './Utility.js'
import Arena from './World/Arena.js';

let pointerEvents = require('pixelbox/pointerEvents');

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

let DIRECTIONS = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
};

let PIXEL_SCALE = 8;
let FPS = 1/60;

let TILE_WIDTH = 16;
let TILE_HEIGHT = 16;

let LOGGING_ON = true;
let LOAD_COMPLETE = false;
let EM;
let UTIL = new Utility();

let TURN_PHASES = {
    PLAYER_1_INPUT: 0,
    PLAYER_2_INPUT: 1,
    ACTION: 2
}

function TURN_PHASE_NAME(turnPhase)
{
    let name = "ERROR";

    switch(turnPhase)
    {
        case TURN_PHASES.PLAYER_1_INPUT:
            name= "PLAYER_1_INPUT";            
            break;
        case TURN_PHASES.PLAYER_2_INPUT:
            name= "PLAYER_2_INPUT";
            break;
        case TURN_PHASES.ACTION:
            name= "ACTION";
            break;
    }

    return name;
}

function consoleLog(logData) {
    if(LOGGING_ON) console.log(logData); 
}

function GetLevelDataByName(levelName)
{
    let levelData = null;

    for(let i = 0; i < assets.levels.data.length; i ++)
    {
        if(assets.levels.data[i].levelName === levelName)
        {
            levelData = assets.levels.data[i];
        }    
    }

    return levelData;
}

function getObjectConfig(objectName)
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

    return objectConf;
}

function SETUP(levelName)
{
    EM = new EntityManager();

    let levelData = GetLevelDataByName(levelName);

    let flowManager = new FlowManager();

    EM.AddEntity("FLOW", flowManager);

    EM.AddEntity("ARENA", new Arena(levelData));

    flowManager.GrabObjects();

    LOAD_COMPLETE = true;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {
	if(!LOAD_COMPLETE)
    {
        SETUP("TestLevel");
    }

    EM.Input();
    EM.Update(FPS);
    EM.Render();
};

export {
    consoleLog, EM, SETUP, PIXEL_SCALE, TILE_WIDTH, TILE_HEIGHT, FPS, UTIL, DIRECTIONS, TURN_PHASES, TURN_PHASE_NAME, getObjectConfig
}
