import { consoleLog, EM } from "../main";

export default class Upgrade
{
    constructor(description)
    {
        this.gameWorld = null;
        this.description = description;
    }

    GameWorld()
    {
        if(this.gameWorld === null)
        {
            this.gameWorld = EM.GetEntity("GAMEWORLD");
        }

        return this.gameWorld;
    }

    ApplyUpgrade()
    {
        console.warn("ABSTRACT UPGRADE");

        this.UpgradeFinished();
    }

    UpgradeFinished()
    {
        this.GameWorld().UpgradeApplied(this);
    }

}