import Container from "./Container";
import { consoleLog } from "./main";
import OxygenUpgrade from './OxygenUpgrade.js'

export default class TreasureChest extends Container
{
    constructor(position, spriteIndex, contents)
    {
        super(position, spriteIndex);

        this.contents = contents;
        this.openedSprite = 2;
        this.closedSprite = 3;
    }

    SetState(state)
    {
        this.state = state;

        if(state === this._OPENED)
        {
            this.spriteIndex = this.openedSprite;
        }
        else if(state === this._CLOSED)
        {
            this.spriteIndex = this.closedSprite;
        }
    }

    Interact()
    {
        var spawnPos = this.GetSpawnPosition();

        if(this.state === this._CLOSED)
        {
            this.SetState(this._OPENED);

            if(this.contents.type === "OXYGEN")
            {
                consoleLog("SPAWN OXYGEN UPGRADE");
                consoleLog(spawnPos);
                var upgrade = new OxygenUpgrade(spawnPos);
            }
        }
    }
}