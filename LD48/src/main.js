import Diver from './Diver.js';
import EntityManager from './EntityManager.js'
import SeaBed from './SeaBed.js';
import TreasureChest from './TreasureChest.js';
import Clam from './Clam.js';
import BubbleCluster from './BubbleCluster.js';
import OxygenMeter from './OxygenMeter.js';

var p2 = require('p2');

var UP = 1;
var DOWN = 2;
var LEFT = 3;
var RIGHT = 4;
var INTERACT = 5;

var BUBBLE_SPRITES = [ 22, 23 ];

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
        },
        new OxygenMeter({x: 480, y: 60, w: 30, h: 400}));

    var seabed = new SeaBed("map");
    
    var chest = new TreasureChest({ x: 9, y: 13}, 3);
    var clam = new Clam({ x: 13, y: 13}, 57);
    
    var bubbles = new BubbleCluster({x: 6, y: 15});

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
    UP, DOWN, LEFT, RIGHT, INTERACT,
    BUBBLE_SPRITES,
    consoleLog
}
