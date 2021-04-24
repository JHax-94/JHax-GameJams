import Diver from './Diver.js';
import EntityManager from './EntityManager.js'
import SeaBed from './SeaBed.js';

var p2 = require('p2');

var UP = 1;
var DOWN = 2;
var LEFT = 3;
var RIGHT = 4;

var LOAD_COMPLETE = false;

var CONSOLE_ON = true;

var em = null; 

var FPS =  1/60;

var PIXEL_SCALE = 16;

function consoleLog(obj)
{
    if(CONSOLE_ON)
    {
        console.log(obj);
    }
}

function Setup()
{
    em = new EntityManager();

    var diver = new Diver(
        { x: 0, y: 0 }, 
        {
            spriteList: [
                { index: 16, offset: { x: 0, y: 0}},
                { index: 48, offset: { x: 0, y: 1}}
            ]        
        })

    var seabed = new SeaBed("map");
    
    em.drawColliders = true;
    


    LOAD_COMPLETE = true;

    consoleLog("setup complete!");
    consoleLog(em);
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {
	if(!LOAD_COMPLETE)
    {
        Setup();
    }
    
    em.Input();
    em.Update(FPS);
    em.Render();
};

export {
    p2, 
    em,
    PIXEL_SCALE,
    UP, DOWN, LEFT, RIGHT,
    consoleLog
}
