var canvas = document.createElement('canvas');
canvas.id = "game-canvas";
canvas.width = "1024";
canvas.height = "768";
canvas.style.zIndex = 8;
canvas.position = "absolute";
canvas.border = "1px solid";

var os;

var updateList = [];

var ctx;

var LS_MACHINE_CONFIG = 0;
var LS_FILE_SYSTEM = 1;
var LS_FINISHED = 2;

var loadingStep = 0;

var KEYCODE_ENTER = 13;
var enterDown = false;

var delta = 0;
var lastFrameMs = 0;
var fps = 60;

var computer;

var GAME_STATE_LOADING = 0;
var GAME_STATE_RUNNING = 1;

var gameState = 0;

var machineConfig;

var frameTimeMs = 1000/fps;
var frameTime = frameTimeMs / 1000;

var machine = 0;
var input;

var cmd;

function strComp(strA, strB)
{
	return strA.toLowerCase() === strB.toLowerCase();
}

window.onload = function() {
	var holder = document.getElementById("canvas-holder");
	holder.appendChild(canvas);
	
	input = this.document.getElementById("cmdLine");
	input.focus();

	ctx = canvas.getContext('2d');
	
	this.loadJSON(function(response) { machineConfig = JSON.parse(response); }, "data/machineConfig.json");

	canvas.onfocus = function()
	{
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
		input.focus();
	}

	requestAnimationFrame(masterLoop);
}

function loadJSON(callback, jsonFile)
{
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', jsonFile, true);
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
	if(loadingStep === LS_MACHINE_CONFIG)
	{
		if(typeof(machineConfig) !== 'undefined')
		{
			console.log("Machine configs loaded...");
			machine = RandomInt(0, machineConfig.machines.length);
			loadingStep = LS_FILE_SYSTEM;
			var fileSystem = machineConfig.machines[machine].files;
			this.loadJSON(function(response) { os = JSON.parse(response) }, "data/" + fileSystem);
		}
	}
	else if(loadingStep === LS_FILE_SYSTEM)
	{
		if(typeof(os) !== 'undefined')
		{
			console.log("File system loaded");
			loadingStep = LS_FINISHED;
		}
	}
	else
	{
		gameState = GAME_STATE_RUNNING;

		computer = new Directory(os.os.drive[0]);
		
		computer.programs = [];
		
		cmd = new CommandLine(computer, machineConfig.gameSetup.caretBlinkOn, machineConfig.gameSetup.caretBlinkOff, input);
		
		computer.programs.push({ name: "sys_auth", program: new SysAuth(cmd) });

		var loadingProgram = [];
		loadingProgram.push("print Loading...");
		loadingProgram.push("wait 0.2");
		loadingProgram.push("print Machine loaded!");
		loadingProgram.push("wait 0.2");
		loadingProgram.push("print Loading machine config...");
		loadingProgram.push("wait 0.2");
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