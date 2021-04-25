import Container from "./Container";
import Jet from "./Jet";
import KeyCollectable from "./KeyCollectable";
import { consoleLog } from "./main";
import OxygenUpgrade from './OxygenUpgrade.js'
import TopUp from "./TopUp";
import TreasureMap from "./TreasureMap";

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

            consoleLog("OPEN CHEST");
            consoleLog(this.contents);

            if(this.contents.type === "OXYGEN")
            {
                consoleLog("SPAWN OXYGEN UPGRADE");
                consoleLog(spawnPos);
                var upgrade = new OxygenUpgrade(spawnPos);
            }
            else if(this.contents.type === "KEY")
            {
                consoleLog("SPAWN KEY");
                
                var key = new KeyCollectable(spawnPos, this.contents);
            }
            else if(this.contents.type === "MAP")
            {
                var map = new TreasureMap(spawnPos, this.contents);
            }
            else if(this.contents.type === "JET")
            {
                var jet = new Jet(spawnPos);
            }
            else if(this.contents.type === "TOPUP")
            {
                var topup = new TopUp(spawnPos);
            }
        }
    }
}