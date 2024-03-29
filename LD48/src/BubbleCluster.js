import Collectable from "./Collectable";
import { em, BUBBLE_SPRITES, PIXEL_SCALE, SFX } from "./main";

export default class BubbleCluster extends Collectable
{
    constructor(spawnPosition)
    {
        super(spawnPosition)

        this.collectDelay = 0;

        this.riseSpeed = 12;

        this.sfx = SFX.bubbleGet;

        this.bubbleSprites = [];

        this.oxygenRestore = 6;

        this.bloopSprite = 124;

        this.bubbleSprites.push({
            offset: { x: 0, y: 0 },
            sprite: BUBBLE_SPRITES[1]
        });

        for(var i = 0; i < 3; i ++)
        {            
            this.bubbleSprites.push({
                offset: { x: (-50 + random(100))/100, y: (-50 + random(100)) / 100 },
                sprite: BUBBLE_SPRITES[0]
            })
        }

        this.bubbleSprites.sort((a, b) => { random(100) });

        em.SetVelocity(this, { x: 0, y: this.riseSpeed });
    }

    InternalCollect(diver)
    {
        diver.AddOxygen(this.oxygenRestore);
    }

    Update(deltaTime)
    {
        //super.Update(deltaTime);
        em.SetVelocity(this, { x: 0, y: this.riseSpeed });
    }

    Draw()
    {
        var position = em.GetPosition(this);

        for(var i =0; i < this.bubbleSprites.length; i ++)
        {
            sprite(this.bubbleSprites[i].sprite, position.x + this.bubbleSprites[i].offset.x*PIXEL_SCALE, position.y + this.bubbleSprites[i].offset.y * PIXEL_SCALE);
        }
    }
}