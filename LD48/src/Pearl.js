import Collectable from "./Collectable";

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
        diver.pearls.push(this.pearlInfo);
    }
}