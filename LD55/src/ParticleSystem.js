import { consoleLog, EM, PIXEL_SCALE } from "./main";

export default class ParticleSystem
{
    constructor(settings)
    {
        this.renderLayer = settings.renderLayer;

        this.particles = [];

        
        /*
        this.particles = new ParticleSystem({
            renderLayer: "CRITTERS",
            max: 50,
            rect: { w: 1, h: 1, c: 23 },
            rootPos: () => { return player.GetScreenPos() },
            offset: {
                r: 1,
            }            
        });*/

        this.maxLength = settings.max;

        this.stopAfterSpawns = 0;
        this.spawnCount = 0;

        this.spawnTime = settings.spawnTime;
        this.lifetime = settings.lifetime;

        this.spawnVelocity = settings.velocity;

        this.offset = settings.offset;

        this.rootPos = settings.rootPos;
        this.rect = settings.rect;

        this.timeSinceSpawn = 0.0;

        this.pos = this.rootPos();

        this.spawningOn = false;

        EM.RegisterEntity(this);

        this.preWarm = settings.preWarm;
    }

    Update(deltaTime)
    {
        this.timeSinceSpawn += deltaTime;

        this.pos = this.rootPos();


        for(let i = 0; i < this.particles.length; i ++)
        {
            let p = this.particles[i];

            p.life += deltaTime;

            if(p.life > p.lifeTime)
            {
                this.particles.splice(i, 1);
                i --;
            }
            else
            {
                if(p.velocity)
                {
                    if(p.velocity.r)
                    {
                        p.r += p.velocity.r * deltaTime;
                        p.x = p.r * PIXEL_SCALE * Math.cos(p.angle) - p.w * PIXEL_SCALE * 0.5;
                        p.y = p.r * PIXEL_SCALE * Math.sin(p.angle) - p.w * PIXEL_SCALE * 0.5;
                    }

                    if(p.velocity.x)
                    {
                        p.x += p.velocity.x * deltaTime;
                    }

                    if(p.velocity.y)
                    {
                        p.y -= p.velocity.y * deltaTime;
                    }
                }
            }
        }

        if(this.spawningOn)
        {
            if(this.timeSinceSpawn > this.spawnTime && this.particles.length < this.maxLength)
            {
                this.Spawn();

                this.timeSinceSpawn = 0.0;
            }
        }
    }

    Spawn()
    {
        let c = 0;

        if(Array.isArray(this.rect.c))
        {
            c = this.rect.c[random(this.rect.c.length)];
        }
        else 
        {
            c = this.rect.c;
        }

        let newParticle = {
            x: 0,
            y: 0,
            w: this.rect.w,
            h: this.rect.h,
            c: c,
            life: 0,
            lifeTime: this.lifetime,
            velocity: this.spawnVelocity
        };

        if(this.offset.r || this.offset.r === 0)
        {
            let angle = Math.random() * 2 * Math.PI;

            newParticle.x = this.offset.r * PIXEL_SCALE * Math.cos(angle) - newParticle.w * PIXEL_SCALE * 0.5;
            newParticle.y = this.offset.r * PIXEL_SCALE * Math.sin(angle) - newParticle.h * PIXEL_SCALE * 0.5;

            newParticle.angle = angle;
            newParticle.r = this.offset.r;
        }
        else if(this.offset.x || this.offset.y)
        {
            
        }


        this.particles.push(newParticle);

        this.spawnCount ++;
        if(this.stopAfterSpawns > 0 && this.spawnCount >= this.stopAfterSpawns)
        {
            this.spawningOn = false;
        }
    }

    SetVelocities(velocity)
    {
        this.spawnVelocity = velocity;
        for(let i = 0; i < this.particles.length; i ++)
        {
            let p = this.particles[i];

            p.velocity = velocity;
        }
    }

    SetLifetime(newLifetime)
    {
        let lifeDiff = newLifetime - this.lifetime;

        this.lifetime = newLifetime;
        for(let i = 0; i < this.particles.length; i ++)
        {
            let p = this.particles[i];
            p.lifeTime += lifeDiff;
        }
    }

    SetMax(newMax)
    {
        this.maxLength = newMax;
    }

    PushRadius(newRadius)
    {
        this.offset.r = newRadius;

        for(let i = 0; i < this.particles.length; i ++)
        {
            let p = this.particles[i];

            p.r = newRadius;
            p.x = p.r * PIXEL_SCALE * Math.cos(p.angle) - p.w * PIXEL_SCALE * 0.5;
            p.y = p.r * PIXEL_SCALE * Math.sin(p.angle) - p.w * PIXEL_SCALE * 0.5;
        }
    }

    Play()
    {
        this.spawnCount = 0;
        this.spawningOn = true;

        if(this.preWarm)
        {
            this.PreWarm();
        }
    }

    PlayOnce()
    {
        this.spawnCount = 0;
        this.stopAfterSpawns = this.maxLength;

        this.spawningOn = true;

        if(this.preWarm)
        {
            this.PreWarm();
        }
    }

    PreWarm()
    {
        while(this.particles.length < this.maxLength && this.spawningOn)
        {
            this.Spawn();
        }
    }

    Off()
    {
        this.spawningOn = false;
    }   

    SkipToEndlife()
    {
        let minLifetime = null;
        for(let i = 0; i < this.particles.length; i ++)
        {
            let remainingLife = this.particles[i].lifeTime - this.particles[i].life;

            if(remainingLife < minLifetime || minLifetime === null)
            {
                minLifetime = remainingLife;
            }
        }

        for(let i = 0; i < this.particles.length; i ++)
        {
            this.particles[i].life += minLifetime;
        }
    }

    Kill()
    {
        this.spawningOn = false;
        this.particles = [];
    }

    DrawSpriteParticle(p)
    {
        
    }

    DrawRectParticle(p)
    {
        paper(p.c);
        let pr = { x: this.pos.x + p.x, y: this.pos.y + p.y, w: p.w * PIXEL_SCALE, h: p.h * PIXEL_SCALE };

        rectf(pr.x, pr.y, pr.w, pr.h);
    }

    Draw()
    {
        paper(9);
        rectf(this.rootPos.x, this.rootPos.y, PIXEL_SCALE, PIXEL_SCALE);

        for(let i = 0; i < this.particles.length; i ++)
        {
            let p = this.particles[i];

            if(p.i)
            {
                this.DrawSpriteParticle(p);
            }
            else 
            {   
                this.DrawRectParticle(p);
            }
        }
    }
    
}