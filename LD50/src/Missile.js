import { vec2 } from "p2";
import { consoleLog, EM, PIXEL_SCALE } from "./main";

export default class Missile 
{
    constructor(position, objConfig)
    {
        this.startSpeed = 1;

        this.turnSpeed = 0.1;

        consoleLog("----- MISSILE -----");
        consoleLog("ObjConfig");
        consoleLog(objConfig);

        this.missileConf = objConfig;
        this.anims = objConfig.missileAnims;

        this.sprite = { index: 4, flipH: false, flipV: false, flipR: false };

        this.difficultyModifier = 1;

        this.alive = true;

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

        consoleLog("Fetching player for missile...");
        this.playerRef = EM.GetEntity("Player");
    }

    Explode()
    {
        this.spriteIndex = 230;
        this.alive = false;
        this.phys.velocity = [0, 0];
    }

    Update(deltaTime)
    {
        if(this.alive)
        {
            this.difficultyModifier += deltaTime * 0.1;

            this.phys.applyForceLocal([0, 1 * this.difficultyModifier]);

            let playerPos = this.playerRef.Position();
            let missilePos = this.Position();

            let posDiff = { x: playerPos.x - missilePos.x, y: playerPos.y - missilePos.y };

            let diffVec = [ posDiff.x, posDiff.y ]; 

            let outVec = [0, 0];

            let upVec = [0, 1];
            
            this.phys.vectorToWorldFrame(outVec, [0, 1]);

            let dotProd = vec2.dot(diffVec, outVec);

            let determinant = outVec[0] * diffVec[1] - outVec[1] * diffVec[0];

            let clockAngleDiff = Math.atan2(determinant, dotProd);

            if(clockAngleDiff < 0)
            {
                this.phys.angularVelocity = -this.turnSpeed * this.difficultyModifier;        
            }
            else if(clockAngleDiff > 0)
            {
                this.phys.angularVelocity = this.turnSpeed * this.difficultyModifier;
            }

            let orientDot = vec2.dot(upVec, outVec);
            let orientDet = outVec[0] * upVec[1] - outVec[1] * upVec[0];
            let orientAngleDiff = Math.atan2(orientDet, orientDot);
            
            if(this.frameCount % 30 === 0)
            {
                for(let i = 0; i < this.anims.length; i ++)
                {
                    let anim = this.anims[i];

                    let animMatches = false;

                    if(orientAngleDiff >= anim.angleFrom * Math.PI && orientAngleDiff < anim.angleTo * Math.PI)
                    {
                        animMatches = true;
                    }
                    
                    if(animMatches)
                    {
                        this.sprite.index = anim.spriteIndex;
                        this.sprite.flipH = anim.flipH;
                        this.sprite.flipV = anim.flipV;
                        this.sprite.flipR = anim.flipR;
                    }

                }   
            }

            this.frameCount ++;
        }
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        sprite(this.sprite.index, screenPos.x, screenPos.y, this.sprite.flipH, this.sprite.flipV, this.sprite.flipR);

        if(this.alive)
        {
            let outVec = [0, 0];

            this.phys.vectorToWorldFrame(outVec, [0, 1]);
        
            paper(9);
            rectf(screenPos.x + 0.5 * PIXEL_SCALE + PIXEL_SCALE * outVec[0] * 2 , screenPos.y + +0.5 * PIXEL_SCALE - PIXEL_SCALE * outVec[1] * 2, 1, 1);
        }
    }    
}