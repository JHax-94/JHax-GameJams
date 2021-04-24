import Container from "./Container";
import { consoleLog } from "./main";
import OxygenUpgrade from './OxygenUpgrade.js'

export default class TreasureChest extends Container
{
    constructor(position, spriteIndex, contents)
    {
        super(position, spriteIndex);

        this.contents = contents;
    }

    Interact()
    {
        var spawnPos = this.GetSpawnPosition();

        if(this.state === this._CLOSED)
        {
            this.spriteIndex = 2;
            if(this.contents.type === "OXYGEN")
            {
                consoleLog("SPAWN OXYGEN UPGRADE");
                consoleLog(spawnPos);
                var upgrade = new OxygenUpgrade(spawnPos);
            }
        }
    }
}