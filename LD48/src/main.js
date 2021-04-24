import Diver from './Diver.js';
import EntityManager from './EntityManager.js'
import SeaBed from './SeaBed.js';
import TreasureChest from './TreasureChest.js';
import Clam from './Clam.js';
import BubbleCluster from './BubbleCluster.js';
import OxygenMeter from './OxygenMeter.js';
import Chart from './Chart.js';

var SEABED_COLLISION_TILES = [131, 132, 133, 134, 135, 148, 149, 150, 151 ];

var CHEST_TILES = [ 3 ]
var CLAM_TILES = [ 57 ]

var pointerEvents = require('pixelbox/pointerEvents');
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

function mapMousePos(x, y)
{
    return { x: x, y: y };
}

pointerEvents.onPress(function(x, y, pointerId, evt) {
    var mapped = mapMousePos(x, y);
    em.MouseClick(mapped.x, mapped.y, evt.button);
});

pointerEvents.onMove(function(x, y, pointerId, evt) {
    var mapped = mapMousePos(x, y);
    em.MouseMove(mapped.x, mapped.y);
});

function consoleLog(obj)
{
    if(CONSOLE_ON)
    {
        console.log(obj);
    }
}

function LoadChart()
{
    em = new EntityManager();

    tilesheet("tilesheet");
    new Chart("chart", { x:0, y: 0 }, {x: 0, y: 0});
}

function LoadDive(diveCoordinates)
{
    em = new EntityManager();
    em.drawColliders = true;
    tilesheet("tilesheet_dive");

    var seabed = new SeaBed("map");
    
    /*var chest = new TreasureChest({ x: 9, y: 13}, 3, { type: "OXYGEN" });
    var clam = new Clam({ x: 13, y: 13}, 57);*/
    
    //var bubbles = new BubbleCluster({x: 6, y: 15});
    
    var diver = new Diver(
        { x: 0, y: 0 }, 
        {
            spriteList: [
                { index: 16, offset: { x: 0, y: 0}},
                { index: 48, offset: { x: 0, y: 1}}
            ]        
        },
        new OxygenMeter({x: 480, y: 60, w: 30, h: 400}));
}

function Setup()
{
    LoadChart();

    LOAD_COMPLETE = true;

    consoleLog(assets);

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
    SEABED_COLLISION_TILES,
    CLAM_TILES,
    CHEST_TILES,
    LoadDive,
    LoadChart,
    consoleLog
}
