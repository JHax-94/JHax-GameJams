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
	if(typeof(machineConfig) === 'undefined')
	{
		console.log("Loading...");
	}
	else
	{
		machine = RandomInt(0, machineConfig.machines.length);
		gameState = GAME_STATE_RUNNING;

		cmd = new CommandLine(machineConfig.gameSetup.caretBlinkOn, machineConfig.gameSetup.caretBlinkOff, input);

		var loadingProgram = [];

		loadingProgram.push("print Loading...");
		loadingProgram.push("wait 1");
		loadingProgram.push("print Machine loaded!");
		loadingProgram.push("wait 0.5");
		loadingProgram.push("print Loading machine config...");
		loadingProgram.push("wait 1");
		loadingProgram.push("print Loaded " + machineConfig.machines[machine].role + " machine!");
		loadingProgram.push("print");

		cmd.runProgram(loadingProgram);
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
    if(timestamp < lastFrameMs + (frameTime)) {
    }
    else {
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