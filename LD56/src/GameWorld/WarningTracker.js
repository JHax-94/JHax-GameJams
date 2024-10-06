import { EM } from "../main";
import Warning from "./Warning";

export default class WarningTracker
{
    constructor(gameWorld)
    {
        this.gameWorld = gameWorld;

        this.warnings = [];
    }

    RemoveWarning(warning)
    {
        for(let i = 0; i < this.warnings.length; i ++)
        {
            if(this.warnings[i] === warning)
            {
                this.warnings.splice(i, 1);
                break;
            }
        }
    }

    AddWarning(object)
    {
        let warningExists = false;

        for(let i = 0; i < this.warnings.length; i ++)
        {
            if(this.warnings[i].object === object)
            {
                warningExists = true;
                this.warnings[i].ExtendWarning();
            }
        }

        if(!warningExists)
        {
            let newWarning = new Warning(object, this.gameWorld, this);

            this.warnings.push(newWarning);
        }
    }
}