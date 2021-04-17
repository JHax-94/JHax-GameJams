import Component from "./Component";
import { em } from "./main";

export default class DangerWire extends Component
{
    constructor(tilePos, spriteData)
    {
        super(tilePos, spriteData, "DANGER_WIRE");

        this.safeTiles = [ 1, 2, 3, 4, 24, 40 ];
    }

    ElectronIsSafe(electron)
    {
        var safe = false;
        var dirVec = electron.GetDirectionVector();

        var targetTile = { x: this.tilePos.x + dirVec.x, y: this.tilePos.y + dirVec.y };

        var movingToTile = em.GetComponentOnTile(targetTile);

        if(movingToTile)
        {
            safe = true;
        }
        else
        {
            var tileData = em.map.get(targetTile.x, targetTile.y);
            
            if(tileData)
            {
                for(var i = 0; i < this.safeTiles.length; i ++)
                {
                    if(this.safeTiles[i] === tileData.sprite)
                    {
                        safe = true;
                        break;
                    }
                }
            }
        }
        
        return safe;
    }
}