var canvas = document.createElement('canvas');
canvas.id = "game-canvas";
canvas.width = "1024";
canvas.height = "768";
canvas.style.zIndex = 8;
canvas.position = "absolute";
canvas.border = "1px solid";

var updateList = [];

var ctx;

var KEYCODE_ENTER = 13;
var enterDown = false;

var delta = 0;
var lastFrameMs = 0;
var fps = 60;

var GAME_STATE_LOADING = 0;
var GAME_STATE_RUNNING = 1;

var gameState = 0;

var machineConfig;

var frameTimeMs = 1000/fps;
var frameTime = frameTimeMs / 1000;

var machine = 0;
var input;

var cmd;

console.log(canvas);

window.onload = function() {
	var holder = document.getElementById("canvas-holder");
	holder.appendChild(canvas);
	
	input = this.document.getElementById("cmdLine");
	input.focus();

	ctx = canvas.getContext('2d');
	
	this.loadJSON(function(response) {
		machineConfig = JSON.parse(response);
		console.log(machineConfig);
	});

	canvas.onfocus = function()
	{
		console.log("Canvas focused...");
		input.focus();
	};

	input.onkeydown = function(event)
	{
		if(enterDown && (event.keyCode === KEYCODE_ENTER))
		{
			enterDown = true;
		}
	}

	input.onkeyup = function(event)
	{
		if(!enterDown && (event.keyCode === KEYCODE_ENTER))
		{
			enterDown = false;
			cmd.submitLine();
		}
	}

	canvas.onclick = function() 
	{
		console.log("On click!");
		input.focus();
	}

	requestAnimationFrame(masterLoop);
}

function loadJSON(callback)
{
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', 'data/machineConfig.json', true);
	xobj.onreadystatechange = function() {
		if(xobj.readyState == 4 && xobj.status == "200")
		{
			callback(xobj.responseText);
		}
	}
	xobj.send(null);
}

function RandomInt(from, to)
{
	return Math.floor((Math.random() * to) + from);
}

function loading()
{
	console.log("Check load state...");
	if(typeof(machineConfig) === 'undefined')
	{
		console.log("Loading...");
	}
	else
	{
		machine = RandomInt(0, machineConfig.machines.length);
		console.log("Done loading! Machine: " + machine);
		gameState = GAME_STATE_RUNNING;

		cmd = new CommandLine(machineConfig.gameSetup.caretBlinkOn, machineConfig.gameSetup.caretBlinkOff, input);

		cmd.addLine("Loading...");
		cmd.addLine("Machine loaded!");
		cmd.addLine("Loading machine config...");
		cmd.addLine("Loaded " + machineConfig.machines[machine].role + " machine!");
		cmd.addLine("");
	}
}

function update(dt)
{
	for(var i = 0; i < updateList.length; i ++)
	{
		updateList[i].update(dt);
	}

	ctx.beginPath();
	ctx.fillStyle='#000000';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.stroke();
	
	//ctx.fillText("C:\\> Hello world!", 10, 200);
	cmd.draw();
}

function masterLoop(timestamp) {
	//console.log("Master loop: " + timestamp + "::" + lastFrameMs + "/" + frameTime);

    if(timestamp < lastFrameMs + (frameTime)) {
    }
    else {
        
		//ctx.clearRect(0, 0, canvas.width, canvas.height)

		if(gameState === GAME_STATE_RUNNING)
		{
			var deltaTime = (timestamp - lastFrameMs)/1000;
			update(deltaTime);
		}
		else 
		{
			loading();
		}

		lastFrameMs = timestamp;
	}
	
    requestAnimationFrame(masterLoop);
}