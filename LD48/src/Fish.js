import { consoleLog, em, FISH_SPRITES, PIXEL_SCALE, ResetGame } from "./main";

export default class Fish 
{
    constructor(depth)
    {
        consoleLog("CONSTRUCTING FISH");
        for(var i = 0; i < 10; i ++)
        {
            consoleLog("Rand:" + random(2));
        }

        this.moveRight = random(2) == 0;

        this.fishes = [];

        this.GenerateFish();

        this.fishSpeed = 8 + random(8);

        var phys = {
            tileTransform: {
                x: this.moveRight ? (-1 - random(3))  : 32 + random(3),
                y: depth,
                w: 1,
                h: 1
            },
            isSensor: true,
            mass: 0,
            tag: "FISH"
        };

        em.AddPhys(this, phys);
        em.AddUpdate(this);
        em.AddRender(this);

        /*
        consoleLog("FISH CONSTRUCTED");
        consoleLog(this);*/
    }

    ResetFish()
    {
        consoleLog("RESETTING FISH");
        this.moveRight = !this.moveRight;
        this.GenerateFish();
    }

    GenerateFish(depth)
    {
        var spawnFish = 1 + random(Math.ceil(depth / 32));
        this.fishes = [];

        this.fishSpeed = 8 + random(8);

        for(var i = 0; i < spawnFish; i ++)
        {
            this.fishes.push(
                {
                    sprite: FISH_SPRITES[random(FISH_SPRITES.length)],
                    offset: { x: -PIXEL_SCALE + random(PIXEL_SCALE+1), y: - PIXEL_SCALE + random(PIXEL_SCALE+1) }
                }
            )
        }
    }

    Update(deltaTime)
    {
        em.SetVelocity(this, { x: this.fishSpeed * (this.moveRight ? 1 : -1), y: 0 });

        var pos = em.GetPosition(this);
        if(this.moveRight)
        {
            if(pos.x > 35 * PIXEL_SCALE)
            {
                this.ResetFish();
            }
        }
        else 
        {
            if(pos.x < -5 * PIXEL_SCALE)
            {
                this.ResetFish();
            }
        }
    }

    Draw()
    {  
        var pos = em.GetPosition(this);
        for(var i = 0; i < this.fishes.length; i ++)
        {
            sprite(this.fishes[i].sprite, pos.x + this.fishes[i].offset.x, pos.y + this.fishes[i].offset.y, !this.moveRight);
        }
    }

}