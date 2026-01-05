import { consoleLog } from "./main";

export default class GameStorageManager
{
    constructor()
    {
        this.memStore = {}

        this.localStorageAvailable = null;

    }

    Clear()
    {
        if(this.localStorageAvailable)
        {
            localStorage.clear()
        }
    }

    GetValueAsBool(keyName)
    {
        var isTrue = null;

        var val = this.GetValue(keyName);

        if(val === "true")
        {
            isTrue = true;
        }
        else if(val === "false")
        {
            isTrue = false;
        }

        return isTrue;
    }

    GetValue(keyName)
    {
        var value = null;

        if(this.localStorageAvailable === null || this.localStorageAvailable === true)
        {
            try
            {
                value = localStorage.getItem(keyName);
                this.localStorageAvailable = true;
            }
            catch(e)
            {
                this.localStorageAvailable = false;
            }
        }
        else 
        {
            value = this.memStore[keyName];
        }

        consoleLog(`Get value: ${keyName} = ${value}`);

        return value;        
    }

    SetValue(keyName, value)
    {
        if(this.localStorageAvailable === null || this.localStorageAvailable === true)
        {
            try
            {
                localStorage.setItem(keyName, value);
                this.localStorageAvailable = true;
            }
            catch(e)
            {
                this.localStorageAvailable = false;
            }
        }
        else 
        {
            this.memStore[keyName] = value;
        }
    }

    static LVL_NAME_KEY(lvlName)
    {
        return `${lvlName}_complete`;
    }

    static SOUND_ON_KEY()
    {
        return "SOUND_ON";
    }
}