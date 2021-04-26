import Diver from './Diver.js';
import EntityManager from './EntityManager.js'
import SeaBed from './SeaBed.js';
import TreasureChest from './TreasureChest.js';
import Clam from './Clam.js';
import BubbleCluster from './BubbleCluster.js';
import OxygenMeter from './OxygenMeter.js';
import Chart from './Chart.js';
import DiveShip from './DiveShip.js';
import ProgressTracker from './ProgressTracker.js';

var STORAGE_KEY = 'LD48_PEARLS_OF_WISDOM';

var SEABED_COLLISION_TILES = [131, 132, 133, 134, 135, 148, 149, 150, 151 ];

var OXYGEN_TANK_SPRITES = { top: 125, mid: 141, bottom: 157 };

var DOOR_REPLACE_MAP = [

    { detect: 131, replace: 115 },
    { detect: 133, replace: 115 },
    { detect: 136, replace: 115 },
    { detect: 137, replace: 115 },
    { detect: 132, replace: 130, replaceFlipped: 114 },
    { detect: 134, replace: 130, replaceFlipped: 114 },
    { detect: 152, replace: 130, replaceFlipped: 114 } 
];

var OPENED = 1;
var CLOSED = 0;

var JET_SPRITE =  158 ;
var TOP_UP_SPRITE = 126;

var OXYGEN_CONF = {
    oxygenPerTank: 18,
    depletionRate: 1
}

var LOCKED_DOOR_TILES = [
    { index: 187, type: "RED" },
    { index: 203, type: "PURPLE" },
    { index: 219, type: "GREEN" }
];

var OXYGEN_TOP_UP = 10;

var RED_KEY_SPRITE = 190;
var PURPLE_KEY_SPRITE = 206;
var GREEN_KEY_SPRITE = 222;

var CHEST_TILES = [ 3 ]
var CLAM_TILES = [ 57 ]

var pointerEvents = require('pixelbox/pointerEvents');
var p2 = require('p2');

var PEARL_DATA;

var DATA_STORE = null;

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

    tilesheet("tilesheet_chart");
    new Chart("chart", { x:0, y: 0 }, {x: 0, y: 0});
}

function GetDiveData(tile)
{
    var chart = assets.chartData.chart;

    var chartEntry = null;

    for(var i = 0; i < chart.length; i++)
    {
        var chartLocation = chart[i].location;

        if(chartLocation.x === tile.x && chartLocation.y === tile.y)
        {
            chartEntry = chart[i];
            break;
        }
    }

    return chartEntry;
}

function ResetGame()
{
    localStorage.removeItem(STORAGE_KEY);
    Setup();
}

function LoadDive(diveCoordinates)
{
    consoleLog("LOAD DIVE");
    consoleLog(diveCoordinates);
    em = new EntityManager();

    var chartEntry = GetDiveData(diveCoordinates);

    em.drawColliders = true;
    tilesheet("tilesheet_dive");

    em.seaBed = new SeaBed(chartEntry);
    
    /*var chest = new TreasureChest({ x: 9, y: 13}, 3, { type: "OXYGEN" });
    var clam = new Clam({ x: 13, y: 13}, 57);*/
    
    //var bubbles = new BubbleCluster({x: 6, y: 15});
    
    var ship = new DiveShip(
        {
            x: 12,
            y: 0,
        },
        [
            { index: 194, offset: { x: -2, y: 0 }},
            { index: 195, offset: { x: -1, y: 0 }},
            { index: 196, offset: { x: 0, y: 0 }},
            { index: 195, offset: { x: 1, y: 0 }},
            { index: 195, offset: { x: 2, y: 0 }},
            { index: 194, flipX: true, offset: { x: 3, y: 0 }},
            { index: 197, offset: { x: 0, y: 1 }}
        ],
        {
            x: 14,
            y: 0,
            w: 1,
            h: 2
        });

    em.diver = new Diver(
        { x: 14, y: 1 }, 
        {
            spriteList: [
                { index: 16, offset: { x: 0, y: 0}},
                { index: 48, offset: { x: 0, y: 1}}
            ]        
        },
        new OxygenMeter({x: 30, y: 1, w: 1, h: 1}, DATA_STORE.GetOxygenTanks()));
}

function InitialiseDataStore()
{
    var saveData = localStorage.getItem(STORAGE_KEY);

    if(typeof(saveData)=='undefined')
    {
        DATA_STORE = new ProgressTracker();   
    }
    else
    {
        DATA_STORE = new ProgressTracker(JSON.parse(saveData));
    }
}

function Setup()
{
    PEARL_DATA = assets.pearlData.pearls;
    InitialiseDataStore();
    
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
    PEARL_DATA,
    DATA_STORE,
    OXYGEN_TANK_SPRITES,
    OXYGEN_CONF,
    LOCKED_DOOR_TILES,
    RED_KEY_SPRITE, PURPLE_KEY_SPRITE, GREEN_KEY_SPRITE, JET_SPRITE, OXYGEN_TOP_UP, TOP_UP_SPRITE,
    STORAGE_KEY,
    OPENED, CLOSED, DOOR_REPLACE_MAP,
    ResetGame,
    GetDiveData,
    LoadDive,
    LoadChart,
    consoleLog
}
