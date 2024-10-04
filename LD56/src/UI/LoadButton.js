import Button from "./Button";
import { consoleLog, SETUP } from "../main";

export default class LoadButton extends Button
{
    constructor(buttonDims, buttonSettings, renderLayer, parent)
    {
        super(buttonDims, buttonSettings, renderLayer, parent);
    }


    ClickEvent(button)
    {
        let params = this.settings.loadParams;

        let loadTarget = this.settings.loadTarget;

        if(this.fetchLoadParams)
        {
            consoleLog(`CUSTOM FETCH PARAMS!`);

            let customFetch = this.fetchLoadParams();

            consoleLog(customFetch);

            params = this.fetchLoadParams();

            if(params.loadTarget)
            {
                loadTarget = params.loadTarget;
            }
        }

        SETUP(loadTarget, params);
    }   
}