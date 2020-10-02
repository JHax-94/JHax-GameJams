import EntityManager from './EntityManager.js'
import Battery from './Battery.js'

var hasRunSetup = false;

var FPS = 1/60;
var TOTAL_SPRITES = 255;

var em;

var CONSOLE_ON = true;

function consoleLog(obj)
{
    if(CONSOLE_ON)
    {
        console.log(obj);
    }
}

function Setup()
{
    paper(1);

    em = new EntityManager();

    var testBox = new Battery({x: 0, y: 0}, 1);    

    hasRunSetup = true;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {
    if(!hasRunSetup)
    {
        Setup();
    }

    em.Update(FPS);
    em.Render();
};

export { em, consoleLog, TOTAL_SPRITES };