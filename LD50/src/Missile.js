import { vec2 } from "p2";
import Explosion from "./Explosion";
import { consoleLog, EM, PIXEL_SCALE, SCREEN_HEIGHT, SCREEN_WIDTH } from "./main";

export default class Missile 
{
    constructor(position, objConfig)
    {
        this.renderLayer = "MISSILE";

        this.missileConf = objConfig;
        this.anims = objConfig.missileAnims;

        this.sprite = { index: 4, flipH: false, flipV: false, flipR: false };

        let config = this.GetMissileConfig(objConfig);

        this.tensionLevel = 0;

        consoleLog("Initialise missile with config:");
        consoleLog(config);

        this.startSpeed = config.startSpeed;
        this.turnSpeed = config.baseTurnSpeed;
        this.difficultyModifier = config.baseDifficultyMultiplier;
        this.difficultyRate = config.difficultyRate;
        this.targetingWait = config.targetingWait;

        let originalMissile = EM.GetEntity("Missile_0");

        if(originalMissile)
        {
            this.difficultyRate = originalMissile.difficultyRate;
            this.tensionLevel = originalMissile.tensionLevel;
        }

        this.alive = true;

        this.frameCount = 0;

        this.spinCountdown = 0;

        this.pushbackForce = 0;
        this.pushbackSpin = 0;

        this.lastClockAngle = 0;
        this.lastNormal = [0, 0];
        this.lastDist = 0;

        this.tensionBooster = false;

        this.spinRecovery = 2.4;

        this.waitForSlowDownStatusWearOff = false;
        this.waitForSpeedUpStatusWearOff = false;

        this.directPullTimer = 0;

        this.boostSpeed = 1;

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

        this.phys.damping = 0.1;
    }

    GetDamping(speed)
    {
        let newDamping = 0.1;

        if(speed > 30 && this.tensionLevel > 1)
        {
            newDamping = 0.1 + ((speed - 30) / 10);

            if(newDamping > 0.5)
            {
                newDamping = 0.5;
            }

            consoleLog(`Damping: ${newDamping}`);
        }

        return newDamping;
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

        let explosion = new Explosion(this.GetScreenPos());
    }

    CalculateTargetingData()
    {
        let td = {};
        td.playerPos = this.playerRef.Position();
        td.missilePos = this.Position();

        td.posDiff = { x: td.playerPos.x - td.missilePos.x, y: td.playerPos.y - td.missilePos.y };

        td.diffVec = [ td.posDiff.x, td.posDiff.y ]; 

        td.outVec = [0, 0];

        td.upVec = [0, 1];

        this.phys.vectorToWorldFrame(td.outVec, td.upVec);

        td.dotProd = vec2.dot(td.diffVec, td.outVec);

        td.determinant = td.outVec[0] * td.diffVec[1] - td.outVec[1] * td.diffVec[0];

        td.clockAngleDiff = Math.atan2(td.determinant, td.dotProd);

        this.lastClockAngle = td.clockAngleDiff;

        return td;
    }

    SetAnimState(td)
    {
        let orientDot = vec2.dot(td.upVec, td.outVec);
        let orientDet = td.outVec[0] * td.upVec[1] - td.outVec[1] * td.upVec[0];
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
    }

    TensionBoost()
    {
        this.difficultyRate *= 1.5;
        this.difficultyModifier += 30;
        this.tensionLevel ++;
        this.tensionBooster = true;
    }


    Update(deltaTime)    
    {
        if(this.alive && this.targetingWait <= 0)
        {   
            let statusModifier = 1;

            let td = this.CalculateTargetingData();

            let speed = vec2.length(this.phys.velocity);

            if(this.playerRef.HasStatus("MissileSpeedDown"))
            {
                statusModifier *= 0.5;

                if(!this.waitForSlowDownStatusWearOff)
                {
                    this.waitForSlowDownStatusWearOff = true;
                    this.phys.velocity = [ 0, 0 ];
                }

                if(speed > this.difficultyModifier * 0.1 )
                {
                    this.phys.velocity = [ this.phys.velocity[0] * (this.difficultyModifier * 0.1 / speed), this.phys.velocity[1] * (this.difficultyModifier * 0.1 / speed)  ];
                }

            }
            else if(this.waitForSlowDownStatusWearOff)
            {
                this.waitForSlowDownStatusWearOff = false;
            }

            if(this.playerRef.HasStatus("MissileSpeedUp") || this.tensionBooster)
            {
                statusModifier *= (this.tensionBooster ? 1.5 : 2);

                let mag = vec2.length(td.diffVec)

                if(!this.waitForSpeedUpStatusWearOff)
                {
                    let oldMag = vec2.length(this.phys.velocity);

                    this.boostSpeed = (oldMag * statusModifier); 

                    this.waitForSpeedUpStatusWearOff = true;
                    this.pushbackForce = 0;
                    this.pushbackSpin = 0;

                    this.directPullTimer = 0.15;
                }

                if(this.directPullTimer >= 0)
                {
                    this.phys.velocity = [ td.diffVec[0] * (this.boostSpeed / mag), td.diffVec[1] * (this.boostSpeed / mag) ];
                    this.directPullTimer -= deltaTime;
                }
                
                if(this.tensionBooster)
                {
                    this.tensionBooster = false;
                }
                
                //consoleLog(`Boost Speed: ${this.boostSpeed}`);
            }
            else if(this.waitForSpeedUpStatusWearOff = true)
            {
                this.waitForSpeedUpStatusWearOff = false;
            }

            this.difficultyModifier += deltaTime * this.difficultyRate;

            this.phys.applyForceLocal([0, 1 * this.difficultyModifier * statusModifier]);

            let desiredAngularVelocity = 0;

            let desiredAngularSpeed = this.turnSpeed * (this.difficultyModifier * 0.25) * (statusModifier * statusModifier) ;

            if(this.difficultyModifier > 40)
            {
                let mag = vec2.length(td.diffVec);
                this.lastDist = mag;

                let distanceModifier = 1;

                if(this.tensionLevel > 0 && mag < 15)
                {
                    distanceModifier *= 40;
                } 
                else if(mag < 30)
                {
                    if(this.difficultyModifier > 160)
                    {
                        distanceModifier *= 30;
                    }
                    else
                    {
                        distanceModifier *= 20;
                    }
                }
                else if(mag > 60)
                {
                    if(this.difficultyModifier > 80)
                    {
                        distanceModifier *= 30;
                    }
                    else
                    {
                        distanceModifier *= 20;
                    }
                }

                let normal = [ td.diffVec[0] / mag, td.diffVec[1] / mag ];

                this.lastNormal = normal;

                let directModifier = 1;

                if(this.difficultyModifier > 90)
                {
                    directModifier = (this.difficultyModifier * (this.tensionLevel +1) - 30) / 60;
                }                

                let directForce = [ normal[0] * directModifier * distanceModifier, normal[1] * directModifier* distanceModifier ];

                this.phys.applyForce(directForce);
            }
            
            if(td.clockAngleDiff < -0.05)
            {
                desiredAngularVelocity = -desiredAngularSpeed;    
            }
            else if(td.clockAngleDiff > 0.05)
            {
                desiredAngularVelocity = desiredAngularSpeed;
            }
            else
            {
                desiredAngularVelocity = 0;
            }

            if(this.pushbackForce > 0)
            {
                let magnitude = Math.sqrt(vec2.squaredLength(td.diffVec));

                let impulseMultipler = (this.pushbackForce / magnitude) * -1;
                
                let impulseVector = [ td.diffVec[0] * impulseMultipler,  td.diffVec[1] * impulseMultipler]

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

            this.phys.damping = this.GetDamping(speed);

            this.SetAnimState(td);
        }
        else if(this.targetingWait > 0)
        {
            //consoleLog(`Remaining targeting wait: ${this.targetingWait}`);

            let td = this.CalculateTargetingData();
            /*
            consoleLog("Target data");
            consoleLog(td);*/
            this.phys.applyForceLocal([0, 1 * this.difficultyModifier]);

            this.targetingWait -= deltaTime;

            this.SetAnimState(td);

            if(this.targetingWait < 0)
            {
                //consoleLog("START TARGETING!");
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

    OutOfBounds(screenPos)
    {
        let outOfBounds = false;

        if(screenPos.x < 0 || screenPos.y < 5 || screenPos.x >= SCREEN_WIDTH * PIXEL_SCALE || screenPos.y >= SCREEN_HEIGHT * PIXEL_SCALE)
        {
            outOfBounds = true;
        }

        return outOfBounds;
    }


    GetBoundedPos(screenPos)
    {
        let boundedPos = { x: screenPos.x, y: screenPos.y, flipH: false, flipV: false, flipR: false };

        let dir = "";

        if(screenPos.x < 0)
        {
            dir = "left";
            boundedPos.x = 0;
        }
        else if(screenPos.x >= SCREEN_WIDTH * PIXEL_SCALE)
        {

            dir = "right";
            boundedPos.x = (SCREEN_WIDTH-1) * PIXEL_SCALE;
        }

        if(screenPos.y < 5)
        {
            dir = "up";
            boundedPos.y = 5;
        }
        else if(screenPos.y >= SCREEN_HEIGHT * PIXEL_SCALE)
        {
            dir = "down";
            boundedPos.y = (SCREEN_HEIGHT-1) * PIXEL_SCALE;
        }

        if(dir === "down")
        {
            boundedPos.flipR = true;
        }

        if(dir === "up")
        {
            boundedPos.flipR = true;
            boundedPos.flipV = true;
        }

        if(dir === "left")
        {
            boundedPos.flipH = true;
        }

        return boundedPos;
    }

    Draw()
    {
        /*
        pen(0);
        print(`Difficulty: ${this.difficultyModifier.toFixed(2)}`, 14*PIXEL_SCALE, 5*PIXEL_SCALE);
        print(`Clock Angle Diff: ${this.lastClockAngle.toFixed(2)}`, 0*PIXEL_SCALE, 5* PIXEL_SCALE);
        print(`Normal Vec: (${this.lastNormal[0].toFixed(2)}, ${this.lastNormal[1].toFixed(2)})`, 0*PIXEL_SCALE, 6*PIXEL_SCALE);
        print(`Distance: ${this.lastDist.toFixed(2)}`, 0*PIXEL_SCALE, 7*PIXEL_SCALE);*/
        if(this.alive)
        {
            let screenPos = this.GetScreenPos();

            sprite(this.sprite.index, screenPos.x, screenPos.y, this.sprite.flipH, this.sprite.flipV, this.sprite.flipR);

            if(this.OutOfBounds(screenPos))
            {
                consoleLog("OUT OF BOUNDS");
                let boundedPos = this.GetBoundedPos(screenPos);
                sprite(207, boundedPos.x, boundedPos.y, boundedPos.flipH, boundedPos.flipV, boundedPos.flipR);
            }

            if(this.alive)
            {
                let outVec = [0, 0];

                this.phys.vectorToWorldFrame(outVec, [0, 1]);
            
                paper(9);
                rectf(screenPos.x + 0.5 * PIXEL_SCALE + PIXEL_SCALE * outVec[0] * 2 , screenPos.y + +0.5 * PIXEL_SCALE - PIXEL_SCALE * outVec[1] * 2, 1, 1);
            }
        }
    }    
}