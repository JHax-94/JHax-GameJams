import EntityManager from './EntityManager.js'
import Maze from './Maze.js'
import Missile from './Missile.js';

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

function SETUP()
{
    consoleLog("==== STARTING SETUP ====");

    consoleLog("-- Building Entity Manager --");

    EM = new EntityManager();

    consoleLog("-- Entity Manager build --");
    
    let levelData = GetLevelDataByName("josh_test");

    consoleLog("Found level:");
    consoleLog(levelData);

    /*
    EM.AddEntity("LevelMap", new LevelMap(levelData, true));
    EM.AddEntity("Clock", new Clock(levelData.startTime, levelData.schedule));
    */  

    EM.AddEntity("Maze", new Maze(levelData));

    EM.AddEntity("Missile", new Missile({ x: 3, y: 10 }));

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
    consoleLog
}