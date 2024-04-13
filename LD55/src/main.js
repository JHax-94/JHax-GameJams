import EntityManager from './EntityManager.js'
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

let PIXEL_SCALE = getPixelScale();
let FPS = 1/60;
let TILE_WIDTH = getTileWidth();
let TILE_HEIGHT = getTileHeight();
let LOGGING_ON = true;

let LOAD_COMPLETE = false;
let EM = null;

let UI_BUILDER = new UiBuilder();

function SETUP(levelName)
{

    LOAD_COMPLETE = true;

    EM = new EntityManager();
}

let frameCount = 0;


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {
    if(!LOAD_COMPLETE)
    {
        SETUP();
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
