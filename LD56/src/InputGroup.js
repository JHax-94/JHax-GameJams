import InputMethod from "./InputMethod";
import { INPUT_TYPE } from "./InputType";

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

    MergePads(mappedInputs)
    {
        let mergePad = {};

        for(let key in mappedInputs)
        {
            let pad = mappedInputs[key];

            for (let btn in pad.src)
            {
                if(!mergePad[btn] || !mergePad[btn].state)
                {
                    mergePad[btn] = pad.src[btn];
                }
            }
        }

        return new InputMethod("merge", INPUT_TYPE.MERGE, mergePad);
    }

    Input(mappedInputs)
    {
        let mergePad = null;

        for(let i = 0; i < this.inputListeners.length; i ++)
        {
            if(this.inputListeners[i].inputSource === -1)
            {
                if(!mergePad)
                {
                    mergePad = this.MergePads(mappedInputs);
                }

                this.inputListeners[i].Input(mergePad, mappedInputs);
            }
            else if(this.inputListeners[i].inputSource)
            {
                let padState = mappedInputs[this.inputListeners[i].inputSource];

                this.inputListeners[i].Input(padState);
            }
            else
            {
                this.inputListeners[i].Input(btn);
            }
        }


    }
}