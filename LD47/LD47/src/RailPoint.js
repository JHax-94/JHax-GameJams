import { consoleLog, em, PIXEL_SCALE, SAFE_TILES } from "./main";

export default class RailPoint
{
    constructor(tilePos, dirMap)
    {
        this.tilePos = tilePos;
        this.dirMap = dirMap;

        this.z = 2;

        /*
        consoleLog("RAIL POINT CONSTRUCTED");
        consoleLog(this);
        */  
        em.AddPhys(this, { 
            mass: 1,
            position: [ (this.tilePos.x+0.5)*PIXEL_SCALE, -(this.tilePos.y + 0.5)*PIXEL_SCALE ],
            isSensor: true,
            tag: "POINTS",
            isKinematic: true,
            colliderRect: { width: PIXEL_SCALE, height: PIXEL_SCALE }
        });
        //em.AddRender(this);
    }

    ElectronIsSafe(electron)
    {
        return em.ElectronIsSafe(this.tilePos, electron);
    }

    GetVert()
    {
        var dir = "";
        //consoleLog("FIND VERT: " + this.dirMap.dir);
        for(var i = 0; i < this.dirMap.dir.length; i ++)
        {
            //consoleLog(this.dirMap.dir[i]);
            
            if(this.dirMap.dir[i] === 'U' || this.dirMap.dir[i] === 'D')
            {
                dir = this.dirMap.dir[i];
                break;
            }
        }

        return dir;
    }

    GetHoriz()
    {
        var dir = "";
        //consoleLog("FIND HORIZ: " + this.dirMap.dir);
        for(var i = 0; i < this.dirMap.dir.length; i ++)
        {
            //consoleLog(this.dirMap.dir[i]);
            if(this.dirMap.dir[i] === 'L' || this.dirMap.dir[i] === 'R')
            {
                dir = this.dirMap.dir[i];
                break;
            }
        }
        return dir;
    }

    GetFlippedDirection(velocity)
    {
        /*
        consoleLog("FLIP VELOCITY");
        consoleLog(velocity);
        */

        var newVelocity = [0, 0];

        var h = this.GetHoriz();
        var v = this.GetVert();

        //consoleLog("H = " + h + ", V = " + v);

        if(Math.abs(velocity[0]) > Math.abs(velocity[1])) // X > Y - Moving Horizontally
        {
            // Flip to Vertical movement
            
            //consoleLog("H to V");

            if(velocity[0] > 0 && h === "R" || velocity[0] < 0 && h === "L")
            {
                //consoleLog("FORWARD FLIP");
                velocity[1] = v === "U" ? 1 : -1;
            }
            else if(velocity[0] > 0 && h === "L" || velocity[0] < 0 && h === "R")
            {
                //consoleLog("BACKWARDS FLIP");
                velocity[1] = v === "U" ? -1 : 1;
            }
            else
            {
                //consoleLog("Y NOT SET!");
            }

            velocity[0] = 0;
        }
        else if(Math.abs(velocity[1]) > Math.abs(velocity[0])) // Y > X - Moving Vertically
        {
            // Flip to Horizontal movement
            /*
            consoleLog("V to H");
            consoleLog(this.dirMap.dir);
            consoleLog("E Direction: " + ((velocity[1] > 0) ? "UP" : "DOWN"));
            */
            if(velocity[1] > 0 && v === "U" || velocity[1] < 0 && v === "D")
            {
                //consoleLog("FOLLOW HORIZ");
                velocity[0] = h === "R" ? -1 : 1;
            }
            else if(velocity[1] > 0 && v === "D" || velocity[1] < 0 && v === "U")
            {
                //consoleLog("FLIP HORIZ");
                velocity[0] = h === "R" ? -1 : 1;
            }
            else 
            {
                consoleLog("X NOT SET!");
            }
            
            velocity[1] = 0;
        }

        return velocity;
    }
    /*
    Draw()
    {
        pen(9);
        rect(this.phys.position[0] - 0.5*PIXEL_SCALE, - this.phys.position[1] - 0.5*PIXEL_SCALE, PIXEL_SCALE, PIXEL_SCALE);
    }*/

}