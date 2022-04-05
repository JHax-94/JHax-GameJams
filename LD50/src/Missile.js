import { vec2 } from "p2";
import { sortAxisList } from "p2/src/collision/SAPBroadphase";
import Explosion from "./Explosion";
import { consoleLog, EM, PIXEL_SCALE, SCREEN_HEIGHT, SCREEN_WIDTH } from "./main";
import ParticleEmitter from "./ParticleEmitter";

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

        this.screenYLimit = 5;

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

        this.particles = new ParticleEmitter(
            this.GetScreenPos(),
            {
                emitTime: 0.2,
                offsetRange: {
                    xMin: 0,
                    xMax: 5,
                    yMin: 0,
                    yMax: 0
                },
                granularity: 1000,
                colourRange: [ 9, 10, 11 ],
                lifeRange: { min: 1, max: 2 }
            });
        this.particles.TrackObject(this);
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
        this.difficultyRate *= 1.2;
        this.difficultyModifier += 10;
        this.tensionLevel ++;
        this.tensionBooster = true;
    }


    GetEmissionDirection()
    {
        return { vx: -this.phys.velocity[0], vy: this.phys.velocity[1] };
    }

    Update(deltaTime)    
    {
        if(this.alive && this.targetingWait <= 0)
        {   
            let statusModifier = 1;

            let td = this.CalculateTargetingData();

            let speed = vec2.length(this.phys.velocity);

            let dampingOverride = null;

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

            if(this.playerRef.HasStatus("MissileSpeedUp") || this.tensionBooster || (this.tensionLevel > 0 && this.CheckLazyPlayer()))
            {
                if(this.playerRef.HasStatus("MissileSpeedUp") || this.tensionBooster)
                {
                    statusModifier *= (this.tensionBooster ? 1.2 : 1.5);
                }
                
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

            let dist = vec2.length(td.diffVec);

            if(this.difficultyModifier > 40)
            {
                let mag = dist;

                this.lastDist = mag;

                let distanceModifier = 1;

                if(this.tensionLevel > 0 && mag < 15)
                {
                    distanceModifier *= 40;
                } 
                else if(mag < 35)
                {
                    if(this.difficultyModifier > 160)
                    {
                        distanceModifier *= 30;
                    }
                    else
                    {
                        
                        distanceModifier *= 30;
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

                /*
                consoleLog("APPLYING DIRECT FORCE!");
                consoleLog(directForce);
                */
                if(this.tensionLevel > 0)
                {
                    dampingOverride = 0.1;
                }
                else if(this.tensionLevel > 1)
                {
                    dampingOverride = 0.1;
                }
                
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

            //consoleLog(`s: ${speed.toFixed(3)}, d: ${dist.toFixed(3)}`);

            if(speed > 45)
            {
                consoleLog("DAMPING");
                dampingOverride = 0.2
            }            

            if(speed > 60)
            {
                consoleLog("HIGH DAMPING");
                dampingOverride = 0.3
            }            

            if(speed > 80)
            {
                consoleLog("VERY HIGH DAMPING");
                dampingOverride = 0.3
            }            

            if(dampingOverride)
            {
                this.phys.damping = dampingOverride;                
            }
            else
            {
                this.phys.damping = this.GetDamping(speed);
            }

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

    CheckLazyPlayer()
    {
        let isPlayerLazy = false;

        if(this.playerRef.isDecoy)
        {
            isPlayerLazy = this.playerRef.staticTimer > 45;
        }
        else 
        {
            isPlayerLazy = this.playerRef.staticTimer > 10;
        }

        if(isPlayerLazy)
        {
            consoleLog("LAZY PLAYER!!!");
        }

        return isPlayerLazy;
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

        if(screenPos.x < 0 || screenPos.y < this.screenYLimit * PIXEL_SCALE || screenPos.x >= SCREEN_WIDTH * PIXEL_SCALE || screenPos.y >= SCREEN_HEIGHT * PIXEL_SCALE)
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

        if(screenPos.y < this.screenYLimit * PIXEL_SCALE)
        {
            dir = "up";
            boundedPos.y = this.screenYLimit * PIXEL_SCALE;
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

    GetEmissionPos()
    {
        let outVec = [0, 0];

        let screenPos = this.GetScreenPos();

        this.phys.vectorToWorldFrame(outVec, [0, 1]);
        
        return { x: screenPos.x + 0.5 * PIXEL_SCALE + PIXEL_SCALE * outVec[0] * 2 , y: screenPos.y + +0.5 * PIXEL_SCALE + PIXEL_SCALE * outVec[1] };
    }

    GetEmissionPositions()
    {
        let upVec = [0, 0];

        let screenPos = this.GetScreenPos();

        this.phys.vectorToWorldFrame(upVec, [0, 0.25]);
        
        let rightVec = [0, 0];
        this.phys.vectorToWorldFrame(rightVec, [1, 0]);

        let centre = { x: screenPos.x + (0.375 - upVec[0]) * PIXEL_SCALE, y: screenPos.y + (0.5 + upVec[1]) * PIXEL_SCALE };

        let spacing = 1;
        let addEitherSide = 1;

        let list = [];

        list.push(centre);

        
        for(let i = 0; i < addEitherSide; i ++)
        {   
            let step = i +1;

            let left = { x: centre.x - step * spacing * rightVec[0], y: centre.y + step * spacing * rightVec[1] };
            let right = { x: centre.x + step * spacing * rightVec[0], y: centre.y - step * spacing * rightVec[1] };

            list.push(left);
            list.push(right);
        }

        return list;
    }

    EmissionTime(baseTime)
    {
        return (baseTime * 10 / vec2.length(this.phys.velocity));
    }

    ParticleLifeTime(baseLife)
    {
        /*
        let rootSpeed = vec2.length(this.phys.velocity) / 2;

        let newLife = baseLife;

        if(rootSpeed > 10)
        {
            consoleLog("LIMIT PARTICLE LIFE");

            newLife = baseLife;
        }
        */
        return baseLife;
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
                let boundedPos = this.GetBoundedPos(screenPos);
                sprite(207, boundedPos.x, boundedPos.y, boundedPos.flipH, boundedPos.flipV, boundedPos.flipR);
            }

            if(this.alive)
            {
                let outVec = [0, 0];

                this.phys.vectorToWorldFrame(outVec, [0, 1]);
            
                paper(9);
                rectf(screenPos.x + 0.5 * PIXEL_SCALE + PIXEL_SCALE * outVec[0] * 2 , screenPos.y + +0.5 * PIXEL_SCALE - PIXEL_SCALE * outVec[1] * 2, 1, 1);

                let emissionPos = this.GetEmissionPositions();

                /*
                consoleLog("DRAW EMITTER");
                
                for(let i = 0; i < emissionPos.length; i ++)
                {
                    paper(3);
                    rectf(emissionPos[i].x, emissionPos[i].y, 2, 2);
                }*/
                
            }
        }
    }    
}