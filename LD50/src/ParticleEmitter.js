import { vec2 } from "p2";
import { consoleLog, EM, PIXEL_SCALE } from "./main";

export default class ParticleEmitter
{
    constructor(position, config)
    {
        this.pos = position;
        this.trackObj = null;

        this.particles = [];

        EM.RegisterEntity(this);


        this.offsetRange = config.offsetRange;
        this.granularity = config.granularity;
        this.colourRange = config.colourRange;
        this.lifeRange = config.lifeRange;

        this.emitterTimer = 0;
        this.emitTime = config.emitTime;
    }

    TrackObject(trackObj)
    {
        this.trackObj = trackObj;
    }

    Update(deltaTime)
    {
        for(let i = 0; i < this.particles.length; i ++)
        {
            let p = this.particles[i];

            p.life -= deltaTime;

            if(p.life < 0)
            {
                this.particles.splice(i, 1);
                i --;
            }
            else
            {
                p.x += p.vx * deltaTime;
                p.y += p.vy * deltaTime;
            }
        }

        this.emitterTimer += deltaTime;
        
        let emitTime = 0;

        if(this.trackObj.EmissionTime)
        {
            emitTime = this.trackObj.EmissionTime(this.emitTime);
        }

        if(this.emitterTimer > emitTime)
        {
            this.emitterTimer -= emitTime;
            this.EmitParticle();
        }
    }

    EmitParticle()
    {
        let spawnCentre = { x : this.pos.x * PIXEL_SCALE, y: this.pos.y * PIXEL_SCALE };

        let emissionVelocity = { vx: 0, vy: 0 };

        let positionsList = [];

        if(this.trackObj)
        {
            let screenPos = this.trackObj.GetEmissionPos();

            spawnCentre = { x: screenPos.x, y: screenPos.y }; 

            if(this.trackObj.GetEmissionPositions)
            {
                positionsList = this.trackObj.GetEmissionPositions();
            }

            if(this.trackObj.GetEmissionDirection)
            {
                emissionVelocity = this.trackObj.GetEmissionDirection();
            }
        }

        let w = 0.3;
        let h = 0.3;
    
        let spawnLoc = null;
        if(positionsList.length > 0)
        {
            //consoleLog("USE POSITION LIST");
            spawnLoc = positionsList[random(positionsList.length)];
        }
        else
        {
            let randomX = random(this.granularity);
            let randomY = random(this.granularity);

            /*
            consoleLog("EMIT USING OFFSET RANGE");
            consoleLog(this.offsetRange);
            */
            
            let spawnOffset = {
                x: this.offsetRange.xMin + (this.offsetRange.xMax - this.offsetRange.xMin) * (randomX / this.granularity),
                y: this.offsetRange.yMin + (this.offsetRange.yMax - this.offsetRange.yMin) * (randomY / this.granularity),
            }

            spawnLoc = { x: spawnCentre.x + spawnOffset.x, y: spawnCentre.y + spawnOffset.y };
        }
        
        let life = this.lifeRange.min;

        if(this.trackObj)
        {
            if(this.trackObj.ParticleLifeTime)
            {
                life = this.trackObj.ParticleLifeTime(life);
            }
        }

        let newParticle = {
            x: spawnLoc.x, y: spawnLoc.y,
            vx: emissionVelocity.vx, vy: emissionVelocity.vy,
            w: w, h: h,
            life: life,
            colour: this.colourRange[random(this.colourRange.length)]
        };

        /*
        consoleLog("NEW PARTICLE");
        consoleLog(newParticle);
        */
        this.particles.push(newParticle);
    }

    Draw()
    {
        for(let i = 0; i < this.particles.length; i ++)
        {
            let p = this.particles[i];

            paper(p.colour);
            rectf(p.x, p.y, p.w * PIXEL_SCALE, p.h * PIXEL_SCALE);
        }
    }

}