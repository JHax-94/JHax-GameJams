import Collectable from "./Collectable";

export default class Pearl extends Collectable
{
    constructor(spawnPosition)
    {
        var physParams = { isKinematic: true };
        super(spawnPosition, physParams);
        
        this.spriteIndex = 68;
    }
    
}