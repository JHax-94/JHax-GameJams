class CommandLine
{
    constructor(blinkOnTime, blinkOffTime, cmdInput)
    {
        this.caretBlinkOn = blinkOnTime;
        this.caretBlinkOff = blinkOffTime;
        this.inputSource = cmdInput;
        updateList.push(this);
    }

    inputOn = false;

    inputSource;
    lines = [];        
    base = { x: 10, y: 30 };
    lineSpacing = 30;
    commandPrompt = "C:\\> ";

    inputText = "";

    waitTime = 0.0;
    waitFor = 0.0;

    caret = "_";
        
    caretOn = false;

    caretTime = 0.0;
    caretBlinkOff = 0.5;
    caretBlinkOn = 0.2;
    caretPosition = 0;

    program = [];

    addLine(line)
    {
        this.lines.push(line);
    }

    runProgram(newProgram)
    {
        this.program = newProgram;
        this.executeNextStep();
    }

    executeNextStep()
    {
        this.processCommand(this.program[0]);
    }
    
    submitLine()
    {
        var command = this.inputText;
        var fullCommand = this.commandPrompt + this.inputText;

        this.addLine(fullCommand);
        this.processCommand(command);
        
        this.addLine("");
        this.inputText = "";
        this.inputSource.value = this.inputText;
    }

    processCommand(cmd)
    {
        var cmdList = cmd.split(" ");
        
        console.log(cmdList);

        if(cmdList.length > 0)
        {
            if(cmdList[0].toLowerCase() === 'cls')
            {
                this.lines = [];
                this.stepFinished();
            }
            else if(cmdList[0].toLowerCase() === 'wait')
            {
                this.waitFor = parseFloat(cmdList[1]);
                console.log("Wait time set to: " + this.waitFor);
                this.inputOn = false;
            }
            else if(cmdList[0].toLowerCase() === 'print')
            {
                var printString = cmd.substr('print '.length, cmd.length - 'print '.length);
                this.addLine(printString);
                this.stepFinished();
            }
        }
    }

    stepFinished()
    {
        if(this.program.length > 0)
        {
            this.program.splice(0, 1);

            if(this.program.length > 0)
            {
                this.executeNextStep();
            }
        }

        if(this.program.length === 0)
        {
            this.inputOn = true;
        }

    }

    update(dt)
    {
        this.caretTime += dt;

        if(this.waitFor > 0)
        {
            this.waitTime += dt;

            if(this.waitTime >= this.waitFor)
            {
                this.waitFor = 0.0;
                this.waitTime = 0.0;
                this.inputOn = true;
                
                this.stepFinished();
            }
        }
        else
        {
            if(this.caretPosition !== this.inputSource.selectionStart)
            {
                this.caretPosition = this.inputSource.selectionStart;
            }

            this.inputText = this.inputSource.value;

            if(this.caretOn)
            {
                if(this.caretTime >= this.caretBlinkOn)
                {
                    this.caretTime = 0.0;
                    this.caretOn = false;
                }
            }
            else
            {
                if(this.caretTime >= this.caretBlinkOff)
                {
                    this.caretTime = 0.0;
                    this.caretOn = true;
                }
            }
        }
    }

    draw()
    {
        ctx.fillStyle = machineConfig.machines[machine].textColour;
        ctx.fontFamily = "'cmd-font', monospace";
        ctx.font = '30px cmd-font';
        ctx.textAlign = 'left';		

        for(var i = 0; i < this.lines.length; i ++)
        {
            ctx.fillText(this.lines[i], this.base.x, this.base.y + i*this.lineSpacing);
        }


        if(this.inputOn)
        {
            var promptString = this.inputText;

            if(this.caretOn)
            {
                if(this.caretPosition < promptString.length)
                {
                    promptString = 
                        promptString.substr(0, this.caretPosition) + 
                        this.caret + 
                        promptString.substr(this.caretPosition + 1, promptString.length - (this.caretPosition+1));
                }
                else
                {
                    promptString += this.caret;
                }
            }

            ctx.fillText(this.commandPrompt +promptString, this.base.x, this.base.y + this.lines.length * this.lineSpacing);
        }
    }
}