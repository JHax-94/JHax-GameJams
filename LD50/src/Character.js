import BriefPlayable from "tina/src/BriefPlayable";
import { consoleLog, EM, PIXEL_SCALE, SETUP } from "./main";

export default class Character
{
    constructor(position, objConfig)
    {   
        this.direction = "down";

        this.spriteIndex = 14;

        consoleLog("Player object config");
        consoleLog(objConfig);

        this.alive = true;

        this.overlaps = [];

        this.statuses = []; 

        this.animFrame = 0;

        this.animTime = 0;

        this.walkSpeed = objConfig.moveSpeed;

        this.anims = objConfig.anims;

        this.moving = false;

        this.physSettings = {
            tileTransform: {
                x: position.x,
                y: position.y,
                w: 0.8,
                h: 0.8
            },
            mass: 10,
            isSensor: false,
            isKinematic: false,
            tag: "PLAYER",
            material: "playerMaterial"
        };

        consoleLog("In player constructor...");
        this.pos = position;

        EM.RegisterEntity(this, { physSettings: this.physSettings });
        consoleLog("Constructed player..");

        EM.physContainer.playerWatch = this;
    }

    OnRegistered()
    {
        consoleLog("CHARACTER REGISTERED!");
    }

    AddOverlap(overlapObj)
    {   
        let hasOverlap = false;

        for(let i = 0; i < this.overlaps.length; i ++)
        {
            if(this.overlaps[i] === overlapObj)
            {
                hasOverlap = true;
                break;
            }
        }

        if(!hasOverlap)
        {
            this.overlaps.push(overlapObj);
        }
    }

    RemoveOverlap(overlapObj)
    {
        let overlapsClear = false;

        for(let i = 0; i < this.overlaps.length; i ++)
        {
            if(this.overlaps[i] === overlapObj)
            {
                this.overlaps.splice(i, 1);
                break;
            }
        }

        if(this.overlaps.length === 0)
        {
            overlapsClear = true;
        }

        return overlapsClear;
    }

    RemoveStatus(statusName, force)
    {
        for(let i = 0; i < this.statuses.length; i ++)
        {
            if(this.statuses[i].name === statusName && (this.statuses[i].time < 0 || force))
            {
                this.statuses.splice(i, 1);
                break;
            }
        }
    }

    AddStatus(statusName, statusTime, conditions, isAdditive)
    {
        let existingStatus = null;

        for(let i = 0; i < this.statuses.length; i ++)
        {
            if(this.statuses[i].name === statusName)
            {
                existingStatus = this.statuses[i];
                break;
            }
        }

        if(existingStatus)
        {
            if(isAdditive)
            {
                existingStatus.time += statusTime;
            }
            else
            {
                existingStatus.time = statusTime;
            }
        }
        else
        {
            this.statuses.push({ name: statusName, time: statusTime, conditions: conditions });
        }
    }

    ActivateGhostMode(time)
    {
        this.AddStatus("GHOST", time, { overlapsClear: true });
    }

    Kill()
    {
        this.spriteIndex = 185;
        this.alive = false;
        this.phys.velocity = [0, 0];
    }

    Update(deltaTime)
    {
        if(this.statuses.length > 0)
        {
            for(let i = 0; i < this.statuses.length; i ++)
            {
                this.statuses[i].time -= deltaTime;

                if(this.statuses[i].time <= 0)
                {
                    if(this.statuses[i].conditions)
                    {
                        if(this.statuses[i].conditions.overlapsClear)
                        {
                            if(this.overlaps.length === 0)
                            {
                                this.RemoveStatus(this.statuses[i].name);
                            }
                        }
                    }
                }
            }
        }

        if(this.moving)
        {
            this.animTime += deltaTime;

            if(this.animTime >= this.anims.frameTime)
            {
                this.animTime -= this.anims.frameTime;

                this.animFrame = (this.animFrame + 1) % this.anims[this.direction].length;
            }
        }
    }
    

    Input(input)
    {
        if(this.alive)
        {
            let moving = false;

            if(input.up)
            {
                this.phys.velocity = [ this.phys.velocity[0] , this.walkSpeed ];
                if(this.direction !== "up")
                {
                    this.direction = "up";
                    this.animFrame = 0;
                }

                moving = true;
            }
            else if(input.down)
            {
                this.phys.velocity = [ this.phys.velocity[0], -this.walkSpeed];
                if(this.direction !== "down")
                {
                    this.direction = "down";
                    this.animFrame = 0;
                }

                moving = true;

            }
            else 
            {
                this.phys.velocity = [ this.phys.velocity[0], 0 ];
            }

            if(input.right)
            {
                this.phys.velocity = [ this.walkSpeed, this.phys.velocity[1] ];
                if(this.direction !== "right")
                {
                    this.direction = "right";
                    this.animFrame = 0;
                }

                moving = true;

            }
            else if(input.left)
            {
                this.phys.velocity = [ -this.walkSpeed, this.phys.velocity[1] ];
                if(this.direction !== "left")
                {
                    this.direction = "left";
                    this.animFrame = 0;
                }

                moving = true;

            }
            else
            {
                this.phys.velocity = [ 0, this.phys.velocity[1] ]; 
            }

            this.moving = moving;
        }
        else 
        {
            if(input.esc)
            {
                SETUP();
            }
        }
    }

    HasStatus(name)
    {
        let hasStatus = false;

        for(let i = 0; i < this.statuses.length; i ++)
        {
            if(this.statuses[i].name === name)
            {
                hasStatus = true;
                break;
            }
        }

        return hasStatus;
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        let anim = this.anims[this.direction][this.animFrame];

        sprite(anim.index, screenPos.x, screenPos.y, anim.flipH, anim.flipV, anim.flipR);

        if(this.statuses)
        {
            for(let i = 0; i < this.statuses.length; i ++)
            {
                pen(10);
                print(`${this.statuses[i].name}: ${this.statuses[i].time}`, 0, (1+i) * PIXEL_SCALE );
            }
        }
    }
    
}