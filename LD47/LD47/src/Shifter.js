import Component from "./Component";
import { consoleLog, em } from "./main";

export default class Shifter extends Component
{
    constructor(tilePos, spriteData, shifter)
    {
        super(tilePos, spriteData);

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

                if(this.shiftAmount < 0 && newPos.y <= this.tilePos.y || this.shiftAmount > 0 && newPos.y >= this.tilePos.y)
                {
                    canMoveAll = false;
                }
            }
            else if(this.shiftDir === "H")
            {
                newPos.x = oldPos.x + this.shiftAmount;
                newPos.y = oldPos.y;
                
                if(this.shiftAmount < 0 && newPos.x <= this.tilePos.x || this.shiftAmount > 0 && newPos.x >= this.tilePos.x)
                {
                    canMoveAll = false;
                }
            }
            /*
            if(this.tilePos.x === newPos.x && this.tilePos.y === newPos.y)
            {
                canMoveAll = false;
                break;
            }*/

            if(!canMoveAll) break;

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
