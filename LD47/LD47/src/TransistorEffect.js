import { consoleLog, em, getAnimation, HOVER_SPRITE, PIXEL_SCALE } from "./main";

export default class TransistorEffect
{
    constructor(centreTile)
    {
        em.AddAnimateFunctions(this);
        this.centreTile = centreTile;

        this.allSides = [];
        this.allCorners = [];

        this.coreAnim = getAnimation("TRANSISTOR_ANIM");

        this.z = 200;

        /*
        consoleLog("TRANSISTOR EFFECT ANIM");
        consoleLog(this.coreAnim);
        */

        this.spriteInfo = { corner: this.coreAnim.frames[0].corner, side: this.coreAnim.frames[0].side };

        this.tl = this.AddEffectTile(centreTile.x - 1, centreTile.y - 1, "TL");
        this.tm = this.AddEffectTile(centreTile.x, centreTile.y - 1, "TM");
        this.tr = this.AddEffectTile(centreTile.x + 1, centreTile.y - 1, "TR");
        this.ml = this.AddEffectTile(centreTile.x - 1, centreTile.y, "ML");
        this.mr = this.AddEffectTile(centreTile.x + 1, centreTile.y, "MR");
        this.bl = this.AddEffectTile(centreTile.x - 1, centreTile.y + 1, "BL");
        this.bm = this.AddEffectTile(centreTile.x, centreTile.y + 1, "BM");
        this.br = this.AddEffectTile(centreTile.x + 1, centreTile.y + 1, "BR");

        em.AddRender(this);
        em.AddUpdate(this);

        /*
        consoleLog("TRANSISTOR EFFECT CONSTRUCTED");
        consoleLog(this);
        */

        this.SetAnimation("TRANSISTOR_ANIM", false);
    }    

    UpdateFrame()
    {
        var frame = this.currentAnimation.frames[this.currentFrame];

        this.spriteInfo.corner = frame.corner;
        this.spriteInfo.side = frame.side;
    }

    AnimationFinished(animation)
    {
        //consoleLog("Animation finished");

        em.RemoveRender(this);
        em.RemoveRender(this);
    }

    AddEffectTile(x, y, pos)
    {
        var newEffectTile = { x: x, y: y, flipX: false, flipY: false, flipR: false };
        var corner = false;

        if(pos === "TL")
        {
            newEffectTile.flipX = true;
            corner = true;
        }
        else if(pos === "TM")
        {
            newEffectTile.flipY = true;
            newEffectTile.flipR = true;
        }
        else if(pos === "TR") { corner = true; }
        else if(pos === "ML") 
        {
            newEffectTile.flipX = true;
        }
        else if(pos === "MR") {}
        else if(pos === "BL")
        {
            corner = true;
            newEffectTile.flipX = true;
            newEffectTile.flipY = true;
        }
        else if(pos === "BM")
        {
            newEffectTile.flipR = true;
        }
        else if(pos === "BR")
        {
            corner = true;
            newEffectTile.flipY = true;
        }

        if(!corner)
        {
            this.allSides.push(newEffectTile);
        }
        else
        {
            this.allCorners.push(newEffectTile);
        }
    }

    Update(deltaTime)
    {
        this.Animate(deltaTime);
    }
    
    Draw()
    {
        for(var i = 0; i < this.allSides.length; i ++)
        {
            sprite(
                this.spriteInfo.side, 
                this.allSides[i].x * PIXEL_SCALE, 
                this.allSides[i].y * PIXEL_SCALE, 
                this.allSides[i].flipX,
                this.allSides[i].flipY,
                this.allSides[i].flipR
            );
        }

        for(var i = 0; i < this.allCorners.length; i ++)
        {
            sprite(
                this.spriteInfo.corner, 
                this.allCorners[i].x * PIXEL_SCALE, 
                this.allCorners[i].y * PIXEL_SCALE, 
                this.allCorners[i].flipX,
                this.allCorners[i].flipY,
                this.allCorners[i].flipR
            );
        }
    }
}