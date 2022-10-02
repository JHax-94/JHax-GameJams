import ControlsDisplay from './ControlsDisplay.js';
import EntityManager from './EntityManager.js'
import FlowManager from './FlowManager.js';
import PersistentData from './PersistentData.js';
import PersistentDataDisplay from './PersistentDataDisplay.js';
import SoundManager from './SoundManager.js';
import ActionBar from './Ui/ActionBar.js';
import Menu from './Ui/Menu.js';
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

function setPlayerPref(key, value)
{
    try
    {
        localStorage.setItem(key, value);
    }
    catch(err)
    {

    }
}

function getPlayerPref(key)
{
    let val = null;

    try
    {
        let readVal = localStorage.getItem(key);
        val = readVal;
    }
    catch(err)
    {

    }

    return val;
}

let DIRECTIONS = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
};

function REVERSE_DIRECTION(dir)
{
    switch(dir)
    {
        case DIRECTIONS.UP:
            return DIRECTIONS.DOWN;
        case DIRECTIONS.DOWN:
            return DIRECTIONS.UP;
        case DIRECTIONS.RIGHT:
            return DIRECTIONS.LEFT;
        case DIRECTIONS.LEFT:
            return DIRECTIONS.RIGHT;
    }
}


let PIXEL_SCALE = 8;
let FPS = 1/60;

let TILE_WIDTH = 33;
let TILE_HEIGHT = 25;

let LOGGING_ON = true;
let LOAD_COMPLETE = false;
let EM;
let UTIL = new Utility();

let DATA = new PersistentData();

let SOUND = null;
let SFX = null;

let TURN_PHASES = {
    PLAYER_1_INPUT: 0,
    PLAYER_2_INPUT: 1,
    ACTION: 2,
    MENU: 3
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

function SETUP(levelName, levelConfig)
{
    EM = new EntityManager();

    let levelData = GetLevelDataByName(levelName);

    consoleLog("set up with level data:");
    consoleLog(levelData);

    if(levelData.type === "arena")
    {
        consoleLog("Load with Config...");
        consoleLog(levelConfig);

        let flowManager = new FlowManager(levelConfig);

        EM.AddEntity("FLOW", flowManager);

        EM.AddEntity("ARENA", new Arena(levelData));

        EM.AddEntity("Display", new ControlsDisplay());

        let actionBarConf = getObjectConfig("ActionBar");

        EM.AddEntity("Player1_Actions", new ActionBar({ x: 0.25, y: 3}, 
        {
            length: 10,
            unfilled: 208,
            filled: 209,
            highlight: 226,
            rowHeight: 1.25,
            indicatorAnims: actionBarConf.indicatorAnims,
            animTime: actionBarConf.animTime,
            offsetMultiplier: 1,
            currentActionPos: { x: 3, y: 1 },
            currentIndicator: { x: 1, y: 1 },
            healthbarStartPos: { x: 3, y: 0.25 }
        }, 
        EM.GetEntity("Player1")));

        EM.AddEntity("Player2_Actions", new ActionBar({ x: TILE_WIDTH-1.25, y: 3},
        {
            length: 10,
            unfilled: 208,
            filled: 193,
            highlight: 192,
            rowHeight: 1.25,
            indicatorAnims: actionBarConf.indicatorAnims,
            animTime: actionBarConf.animTime,
            offsetMultiplier: -1,
            currentActionPos: { x: TILE_WIDTH - 3, y: 1 },
            healthbarStartPos: { x: TILE_WIDTH - 3, y: 0.25 },
            currentIndicator: { x: TILE_WIDTH - 2 , y: 1 }
        },
        EM.GetEntity("Player2")));

        new PersistentDataDisplay();

        flowManager.GrabObjects();
    }
    else if(levelData.type === "menu")
    {
        let menu = new Menu(levelData);
    }

    if(!SOUND)
    {
        SOUND = new SoundManager({x: 22, y: 1}, { speakerIndex: 0, speakerOnIndex: 16, speakerOffIndex: 0, sfxIndex: 16 });
    }

    if(levelData.mapType === "MENU")
    {
        SOUND.PlayTitle();
    }
    else
    {
        SOUND.PlayLevelMusic();
    }

    LOAD_COMPLETE = true;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {
	if(!LOAD_COMPLETE)
    {
        SETUP("Menu");
    }

    EM.Input();
    EM.Update(FPS);
    EM.Render();
};

export {
    consoleLog, EM, SETUP, PIXEL_SCALE, TILE_WIDTH, TILE_HEIGHT, FPS, UTIL, DIRECTIONS, TURN_PHASES, DATA, REVERSE_DIRECTION, TURN_PHASE_NAME, getObjectConfig, getPlayerPref, setPlayerPref
}
