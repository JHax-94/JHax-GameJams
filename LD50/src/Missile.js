import { vec2 } from "p2";
import { consoleLog, EM, PIXEL_SCALE } from "./main";

export default class Missile 
{
    constructor(position, objConfig)
    {
        this.missileConf = objConfig;
        this.anims = objConfig.missileAnims;

        this.sprite = { index: 4, flipH: false, flipV: false, flipR: false };

        let config = this.GetMissileConfig(objConfig);

        consoleLog("Initialise missile with config:");
        consoleLog(config);

        this.startSpeed = config.startSpeed;
        this.turnSpeed = config.baseTurnSpeed;
        this.difficultyModifier = config.baseDifficultyMultiplier;
        this.difficultyRate = config.difficultyRate;

        this.alive = true;

        this.frameCount = 0;

        this.spinCountdown = 0;

        this.pushbackForce = 0;
        this.pushbackSpin = 0;

        this.lastClockAngle = 0;
        this.lastNormal = [0, 0];
        this.lastDist = 0;

        this.spinRecovery = 2.4;

        this.waitForSlowDownStatusWearOff = false;
        this.waitForSpeedUpStatusWearOff = false;

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

        this.phys.velocity = [ 0, this.startSpeed ];
    }

    GetMissileConfig(rootConfig)
    {
        return rootConfig.config;
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
            let statusModifier = 1;

            if(this.playerRef.HasStatus("MissileSpeedDown"))
            {
                statusModifier *= 0.5;

                if(!this.waitForSlowDownStatusWearOff)
                {
                    this.waitForSlowDownStatusWearOff = true;
                    this.phys.velocity = [ 0, 0 ];
                }
            }
            else if(this.waitForSlowDownStatusWearOff)
            {
                this.waitForSlowDownStatusWearOff = false;
            }

            if(this.playerRef.HasStatus("MissileSpeedUp"))
            {
                statusModifier *= 4;

                if(!this.waitForSpeedUpStatusWearOff)
                {
                    this.phys.velocity = [ this.phys.velocity[0] * statusModifier, this.phys.velocity[1] * statusModifier];

                    this.waitForSpeedUpStatusWearOff = true;
                    this.pushbackForce = 0;
                    this.pushbackSpin = 0;
                }
            }
            else if(this.waitForSpeedUpStatusWearOff = true)
            {
                this.waitForSpeedUpStatusWearOff = false;
            }

            this.difficultyModifier += deltaTime * this.difficultyRate;

            this.phys.applyForceLocal([0, 1 * this.difficultyModifier * statusModifier]);

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

            this.lastClockAngle = clockAngleDiff;

            let desiredAngularVelocity = 0;

            let desiredAngularSpeed = this.turnSpeed * this.difficultyModifier * statusModifier

            if(this.difficultyModifier > 40)
            {
                let mag = vec2.length(diffVec);
                this.lastDist = mag;

                let distanceModifier = 1;

                if(mag < 30)
                {
                    

                    if(this.difficultyModifier > 80)
                    {
                        distanceModifier *= 40;
                    }

                    distanceModifier *= 20;
                }
                else if(mag > 60)
                {
                    if(this.difficultyModifier > 80)
                    {
                        distanceModifier *= 40;
                    }

                    distanceModifier *= 20;
                }

                let normal = [ diffVec[0] / mag, diffVec[1] / mag ];

                this.lastNormal = normal;

                let directModifier = 1;

                if(this.difficultyModifier > 60)
                {
                    directForce = this.difficultyModifier / 60;
                }                

                let directForce = [ normal[0] * directModifier * distanceModifier, normal[1] * directModifier* distanceModifier ];

                this.phys.applyForce(directForce);
            }
            
            if(clockAngleDiff < -0.05)
            {
                desiredAngularVelocity = -desiredAngularSpeed;    
            }
            else if(clockAngleDiff > 0.05)
            {
                desiredAngularVelocity = desiredAngularSpeed;
            }
            else
            {
                desiredAngularVelocity = 0;
            }

            let orientDot = vec2.dot(upVec, outVec);
            let orientDet = outVec[0] * upVec[1] - outVec[1] * upVec[0];
            let orientAngleDiff = Math.atan2(orientDet, orientDot);
            if(orientAngleDiff < 0)
            {
                orientAngleDiff += 2*Math.PI;
            }
            
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

            if(this.pushbackForce > 0)
            {
                let magnitude = Math.sqrt(vec2.squaredLength(diffVec));

                let impulseMultipler = (this.pushbackForce / magnitude) * -1;
                
                let impulseVector = [ diffVec[0] * impulseMultipler,  diffVec[1] * impulseMultipler]

                this.phys.applyImpulse(impulseVector);

                this.pushbackForce = 0;
            }   

            if(this.pushbackSpin > 0)
            {
                let setSpin = this.spinDir * this.pushbackSpin;

                this.phys.angularVelocity = setSpin;

                this.pushbackSpin -= deltaTime * this.spinRecovery;

                if(Math.abs(setSpin - desiredAngularVelocity) < 0.1)
                {
                    this.pushbackSpin = 0;
                }
            }
            else 
            {
                this.phys.angularVelocity = desiredAngularVelocity;
            }
        }
    }

    SetTarget(obj)
    {
        this.playerRef = obj;
    }

    TargetPlayer()
    {
        this.playerRef = EM.GetEntity("Player");
    }

    Pushback(pushbackForce, pushbackSpin)
    {
        let randomSpin = random(2);

        if(randomSpin === 0)
        {
            randomSpin = -1;
        }

        this.spinDir = randomSpin;

        this.pushbackForce = pushbackForce;
        this.pushbackSpin = pushbackSpin;
    }

    Draw()
    {

        pen(0);
        print(`Difficulty: ${this.difficultyModifier.toFixed(2)}`, 14*PIXEL_SCALE, 5*PIXEL_SCALE);
        print(`Clock Angle Diff: ${this.lastClockAngle.toFixed(2)}`, 0*PIXEL_SCALE, 5* PIXEL_SCALE);
        print(`Normal Vec: (${this.lastNormal[0].toFixed(2)}, ${this.lastNormal[1].toFixed(2)})`, 0*PIXEL_SCALE, 6*PIXEL_SCALE);
        print(`Distance: ${this.lastDist.toFixed(2)}`, 0*PIXEL_SCALE, 7*PIXEL_SCALE);
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