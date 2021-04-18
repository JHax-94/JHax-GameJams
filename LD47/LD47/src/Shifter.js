import Component from "./Component";
import { consoleLog, em } from "./main";

export default class Shifter extends Component
{
    constructor(tilePos, spriteData, shifter)
    {
        super(tilePos, spriteData);

        this.shifterBoundaryTiles = [ 108, 109, 124 ];

        this.logName = "SHIFTER";

        this.logging = true;

        consoleLog(shifter);

        this.connections = shifter.connections;
        
        this.chargesRequired = shifter.chargesRequired;
        

        this.resetOnFullyCharged = true;

        this.shiftDir = shifter.direction[0];
        this.shiftAmount = 0;

        if(shifter.direction[1] === "+")
        {
            this.shiftAmount = 1;
        }
        else if(shifter.direction[1] === "-")
        {
            this.shiftAmount = -1;
        }

        console.log("constructed shfiter");
        console.log(this);

        
        for(var i = 0; i < shifter.connections.length; i ++)
        {
            consoleLog("Try to hide...");
            consoleLog(shifter.connections[i]);
            
            em.map.remove(shifter.connections[i].tilePos.x, shifter.connections[i].tilePos.y);
        }
    }

    Charged()
    {
        consoleLog("========== SHIFTER FULLY CHARGED! ==========");

        var canMoveAll = true;
        var newPositions = [];

        for(var i = 0; i < this.connections.length; i ++)
        {
            var oldPos = this.connections[i].tilePos;

            var newPos = { x: 0, y: 0 };

            if(this.shiftDir === "V")
            {
                newPos.x = oldPos.x;
                newPos.y = oldPos.y + this.shiftAmount;
            }
            else if(this.shiftDir === "H")
            {
                newPos.x = oldPos.x + this.shiftAmount;
                newPos.y = oldPos.y;
            }

            if(this.tilePos.x === newPos.x && this.tilePos.y === newPos.y)
            {
                canMoveAll = false;
                break;
            }

            if(canMoveAll)
            {
                var newTile = em.map.get(newPos.x, newPos.y);
                consoleLog(newTile);
                
                if(newTile != null)
                {
                    for(var j = 0; j < this.shifterBoundaryTiles.length; j ++)
                    {
                        if(newTile.sprite === this.shifterBoundaryTiles[j])
                        {
                            canMoveAll = false;
                            break;
                        }
                    }
                }
                
            }
            
            newPositions.push(newPos);
        }

        if(canMoveAll)
        {
            consoleLog("Moving components...");
            consoleLog(newPositions);

            for(var i = 0; i < this.connections.length; i++)
            {
                this.connections[i].MoveToTile(newPositions[i]);
            }
        }
    }
}
