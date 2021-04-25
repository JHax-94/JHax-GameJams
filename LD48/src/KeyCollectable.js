import { TopDownVehicle } from "p2";
import Collectable from "./Collectable";
import { consoleLog } from "./main";

export default class KeyCollectable extends Collectable
{
    constructor(spawnPosition, keyInfo)
    {
        var physParams = { isKinematic: true };
        super(spawnPosition, physParams);

        this.type = keyInfo.keyType;
        this.keyInfo = keyInfo;

        this.SetupKey();

        consoleLog("Key constructed:");
        consoleLog(this);
    }

    SetupKey()
    {
        if(this.type === "RED")
        {
            this.spriteIndex = 190;
        }
        else if(this.type === "PURPLE")
        {
            this.spriteIndex = 206;            
        }
        else if(this.type === "GREEN")
        {
            this.spriteIndex = 222;
        }
    }

    InternalCollect(diver)
    {
        diver.AddKey(this.keyInfo);
    }
}