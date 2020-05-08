class CommandLine
{
    constructor(blinkOnTime, blinkOffTime, cmdInput)
    {
        this.caretBlinkOn = blinkOnTime;
        this.caretBlinkOff = blinkOffTime;
        this.inputSource = cmdInput;
        updateList.push(this);
    }

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

    addLine(line)
    {
        this.lines.push(line);
    }
    
    submitLine()
    {
        var command = this.inputText;
        var fullCommand = this.commandPrompt + this.inputText;

        this.addLine(fullCommand);
        this.addLine("");

        this.processCommand(command);

        this.inputText = "";
        this.inputSource.value = this.inputText;
    }

    processCommand(cmd)
    {
        if(cmd.toLowerCase() === 'cls')
        {
            this.lines = [];
        }
    }

    update(dt)
    {
        this.caretTime += dt;

        if(this.caretPosition !== this.inputSource.selectionStart)
        {
            console.log("caret changed...");
            this.caretPosition = this.inputSource.selectionStart;
            console.log(this.caretPosition + "/" + this.inputText.length);
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

        var promptString = this.inputText;

        if(this.caretOn)
        {
            if(this.caretPosition < promptString.length)
            {
                promptString = promptString.substr(0, this.caretPosition) + this.caret + promptString.substr(this.caretPosition + 1, promptString.length - (this.caretPosition+1));
                console.log(promptString);
            }
            else
            {
                promptString += this.caret;
            }
        }

        ctx.fillText(this.commandPrompt +promptString, this.base.x, this.base.y + this.lines.length * this.lineSpacing);
    }
}