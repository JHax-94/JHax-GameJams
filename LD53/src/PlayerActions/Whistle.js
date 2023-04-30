import Texture from "pixelbox/Texture";
import { COLLISION_GROUP, EM, PIXEL_SCALE, TILE_WIDTH, consoleLog } from "../main";
import Aura from "./Aura";

export default class Whistle extends Aura
{
    constructor(src, opts)
    {   
        let type = "WHISTLE";

        if(opts && opts.type)
        {
            type = opts.type;
        }

        let radius = 2 * PIXEL_SCALE;

        if(opts && opts.radius)
        {
            radius = opts.radius;
        }

        super(src, radius, "WHISTLE");

        this.activeTime = 0.8;
        this.activeTimer = 0;

        this.cooldown = 1;
        this.cooldownTimer = 0;

        this.stimType = type;
    }

    Activate()
    {
        this.activeTimer = this.activeTime;

        for(let i = 0; i < this.beasts.length; i ++)
        {
            this.beasts[i].ReactTo(this);
        }
    }

    AddBeastChecks(beast)
    {
        if(this.IsActive())
        {
            beast.ReactTo(this);
        }
    }

    CanActivate()
    {
        return this.IsActive() === false && this.OnCooldown() === false;
    }

    IsActive()
    {
        return this.activeTimer > 0;
    }

    OnCooldown()
    {
        return this.cooldownTimer > 0;
    }

    Act(deltaTime)
    {
        this.phys.position = this.src.phys.position;
        if(this.IsActive())
        {
            this.activeTimer -= deltaTime;

            if(this.activeTimer <= 0 )
            {
                this.activeTimer = 0;
                this.cooldownTimer = this.cooldown;
            }
        }
        else if(this.OnCooldown())
        {
            this.cooldownTimer -= deltaTime;

            if(this.cooldownTimer <= 0)
            {
                this.cooldownTimer = 0;
            }
        }
    }

    Draw()
    {
        if(this.IsActive())
        {
            this.DrawAura({ angle: this.activeTimer });
        }
    }
}