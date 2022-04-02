import { vec2 } from "p2";
import { RECTANGLE } from "p2/src/shapes/Shape";
import { consoleLog, EM, PIXEL_SCALE } from "./main";

export default class Missile 
{
    constructor(position, objConfig)
    {
        this.startSpeed = 1;

        this.turnSpeed = 0.1;

        this.spriteIndex = 177;

        this.frameCount = 0;

        EM.RegisterEntity(this, {
            physSettings: {
                tileTransform: {
                    x: position.x,
                    y: position.y,
                    w: 1,
                    h: 1
                },
                isSensor: true,
                isKinematic: false,
                mass: 10,
                tag: "MISSILE",
                material: "missileMaterial",
                freeRotate: true
            }
        });

        this.playerRef = EM.GetEntity("Player");
    }

    Update(deltaTime)
    {
        this.phys.applyForceLocal([0, 4]);

        let playerPos = this.playerRef.Position();
        let missilePos = this.Position();

        let posDiff = { x: playerPos.x - missilePos.x, y: playerPos.y - missilePos.y };

        let diffVec = [ posDiff.x, posDiff.y ]; 

        let outVec = [0, 0];

        this.phys.vectorToWorldFrame(outVec, [0, 1]);

        let dotProd = vec2.dot(diffVec, outVec);

        let determinant = outVec[0] * diffVec[1] - outVec[1] * diffVec[0];

        let clockAngleDiff = Math.atan2(determinant, dotProd);

//        this.phys.angularVelocity = 0.1;

        
        /*
        if(this.frameCount % 30 === 0)
        {
            consoleLog("Position difference:");
            consoleLog(posDiff);
            consoleLog("Angle:");
            consoleLog(this.phys.angle);
            consoleLog("'Up'");
            consoleLog(outVec);
            
            consoleLog("Dot Prod");
            consoleLog(dotProd);

            consoleLog("Magnitude prod");
            consoleLog(magnitudeProd);

            consoleLog("AngleDiff");
            consoleLog(angleDiff);

            consoleLog("Clock angle diff");
            consoleLog(clockAngleDiff);
        }
        */
        if(clockAngleDiff < 0)
        {
            this.phys.angularVelocity = -this.turnSpeed;        
        }
        else if(clockAngleDiff > 0)
        {
            this.phys.angularVelocity = this.turnSpeed;
        }

        this.frameCount ++;
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        let outVec = [0, 0];

        this.phys.vectorToWorldFrame(outVec, [0, 1]);

        sprite(this.spriteIndex, screenPos.x, screenPos.y);

        paper(9);
        rectf(screenPos.x + 0.5 * PIXEL_SCALE + PIXEL_SCALE * outVec[0] * 2 , screenPos.y + +0.5 * PIXEL_SCALE - PIXEL_SCALE * outVec[1] * 2, 1, 1);
    }    
}