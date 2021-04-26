import Container from "./Container";
import Pearl from "./Pearl";

export default class Clam extends Container
{
    constructor(position, spriteIndex, pearlData)
    {
        super(position, spriteIndex);

        this.closedSprite = 57;
        this.openedSprite = 56;

        this.pearlData = pearlData;
    }    
    
    SetState(state)
    {
        this.state = state;
        if(state === this._CLOSED)
        {
            this.spriteIndex = this.closedSprite;
        }
        else if(state === this._OPENED)
        {
            this.spriteIndex = this.openedSprite;
        }
    }

    Interact()
    {
        if(this.state === this._CLOSED)
        {
            this.SetState(this._OPENED);

            if(this.sfx)
            {
                sfx(this.sfx);
            }
            var spawnPos = this.GetSpawnPosition();

            new Pearl(spawnPos, this.pearlData);
        }        
    }
}