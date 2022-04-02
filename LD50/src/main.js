import Clock from './Clock.js';
import EntityManager from './EntityManager.js'
import Maze from './Maze.js'
import Missile from './Missile.js';
import Menu from './Menu.js';

let pointerEvents = require('pixelbox/pointerEvents');

let p2 = require('p2');

let EM;
let FPS = 1/30;

let LOAD_COMPLETE = false;

let LOGGING_ON = true;

let PIXEL_SCALE = 8;
let SCREEN_WIDTH = 16;
let SCREEN_HEIGHT = 16;

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

function SETUP(levelName)
{
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

    if(levelData.mapType === "MAZE")
    {
        EM = new EntityManager();

        EM.AddEntity("Maze", new Maze(levelData));

        EM.AddEntity("Missile", new Missile({ x: 3, y: 10 }));
        EM.AddEntity("Clock", new Clock());
    }
    else if(levelData.mapType === "MENU")
    {
        EM = new EntityManager(true);

        EM.AddEntity("Menu", new Menu(levelData));
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
    SETUP,
    consoleLog
}