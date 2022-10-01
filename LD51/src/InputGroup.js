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

    Input(inputState)
    {
        for(let i = 0; i < this.inputListeners.length; i ++)
        {
            this.inputListeners[i].Input(inputState);
        }
    }
}