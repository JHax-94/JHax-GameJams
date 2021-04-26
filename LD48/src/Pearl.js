import Collectable from "./Collectable";
import { consoleLog } from "./main";

export default class Pearl extends Collectable
{
    constructor(spawnPosition, pearlInfo)
    {
        var physParams = { isKinematic: true };
        super(spawnPosition, physParams);
        
        this.spriteIndex = 68;

        this.pearlInfo = pearlInfo;
    }
 
    InternalCollect(diver)
    {
        consoleLog("INTERNAL COLLECT BY: ");
        consoleLog(diver); 
        diver.pearls.push(this.pearlInfo);
    }
}