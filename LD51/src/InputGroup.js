import { consoleLog } from "./main";

export default class InputGroup
{
    constructor(name)
    {
        this.name = name;

        this.inputListeners = [];
    }

    AddInput(obj)
    {
        this.inputListeners.push(obj);
    }

    RemoveInput(obj)
    {
        for(let i = 0; i < this.inputListeners.length; i ++)
        {
            if(this.inputListeners[i] === obj)
            {
                this.inputListeners.splice(i, 1);
            }
        }
    }

    Input(btn, pads, mergePad)
    {

        /*
        if(this.name === "BANNER")
        {
            consoleLog(this.inputListeners);
        }*/

        for(let i = 0; i < this.inputListeners.length; i ++)
        {
            if(this.inputListeners[i].inputSource >= 0)
            {
                let padState = pads[this.inputListeners[i].inputSource];

                this.inputListeners[i].Input(padState);
            }
            else if(this.inputListeners[i].inputSource === -1)
            {
                /*consoleLog("Input from any pad...");
                consoleLog(mergePad);*/
                this.inputListeners[i].Input(mergePad);
            }
            else
            {
                this.inputListeners[i].Input(btn);
            }
        }


    }
}