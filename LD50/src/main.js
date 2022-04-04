import Clock from './Clock.js';
import EntityManager from './EntityManager.js'
import Maze from './Maze.js'
import Missile from './Missile.js';
import Menu from './Menu.js';
import PowerUpsBar from './PowerUpsBar.js';
import SoundManager from './SoundManager.js';

let pointerEvents = require('pixelbox/pointerEvents');

let p2 = require('p2');

let SFX = null;
let SOUND = null;

let EM;
let FPS = 1/30;

let LOAD_COMPLETE = false;

let LOGGING_ON = true;

let PIXEL_SCALE = 8;
let SCREEN_WIDTH = 32;
let SCREEN_HEIGHT = 32;

function consoleLog(logData) {
    if(LOGGING_ON) console.log(logData); 
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
    if(!SFX)
    {
        SFX = assets.soundMap;
    }

    consoleLog("==== STARTING SETUP ====");

    consoleLog("-- Building Entity Manager --");

    consoleLog("-- Entity Manager build --");
    
    if(!levelName)
    {
        levelName = "main_menu";
    }
    
    let levelData = GetLevelDataByName(levelName);

    consoleLog("Found level:");
    consoleLog(levelData);

    /*
    EM.AddEntity("LevelMap", new LevelMap(levelData, true));
    EM.AddEntity("Clock", new Clock(levelData.startTime, levelData.schedule));
    */  

    if(EM)
    {
        EM.ClearDown();
    }

    if(levelData.mapType === "MAZE")
    {
        EM = new EntityManager();

        EM.AddEntity("Maze", new Maze(levelData));

        let missileConf = getObjectConfig("Missile");

        let missileList = EM.GetEntitiesStartingWith("Missile_");

        EM.AddEntity(`Missile_${missileList.length}`, new Missile({ x: 31, y: 32 }, missileConf));

        let uiMap = getMap("ui_layer");

        consoleLog("---- UI MAP ---- ");
        consoleLog(uiMap);

        EM.AddEntity("PowerUps", new PowerUpsBar(uiMap));

        EM.AddEntity("Clock", new Clock());
    }
    else if(levelData.mapType === "MENU")
    {
        EM = new EntityManager(true);

        EM.AddEntity("Menu", new Menu(levelData));
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

    if(!EM.GetEntity("SoundManager"))
    {
        EM.RegisterEntity(SOUND);
        EM.AddEntity("SoundManager", SOUND);
    }

    LOAD_COMPLETE = true;

    consoleLog("==== SETUP COMPLETE ====");
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {
	exports.update = function () {
        if(!LOAD_COMPLETE)
        {
            SETUP();
        }
        
        EM.Input();
        EM.Update(FPS);
        EM.Render();
    };
};

export {
    p2,
    EM,
    PIXEL_SCALE, SCREEN_WIDTH, SCREEN_HEIGHT,
    getObjectConfig,
    SETUP,
    SOUND, SFX,
    consoleLog,
    setPlayerPref,
    getPlayerPref
}