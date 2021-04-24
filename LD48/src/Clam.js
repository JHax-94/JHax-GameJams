import Container from "./Container";
import Pearl from "./Pearl";

export default class Clam extends Container
{
    constructor(position, spriteIndex)
    {
        super(position, spriteIndex);
    }    
    
    Interact()
    {
        if(this.state === this._CLOSED)
        {
            this.spriteIndex = 56;
            this.stat === this._OPENED;

            var spawnPos = this.GetSpawnPosition();

            new Pearl(spawnPos);
        }        
    }
}