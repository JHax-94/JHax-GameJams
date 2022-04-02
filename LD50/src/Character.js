import { consoleLog, EM, SETUP } from "./main";

export default class Character
{
    constructor(position, objConfig)
    {
        this.spriteIndex = 174;

        consoleLog("Player object config");
        consoleLog(objConfig);

        this.alive = true;

        this.walkSpeed = objConfig.moveSpeed;

        this.physSettings = {
            tileTransform: {
                x: position.x,
                y: position.y,
                w: 1,
                h: 1
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
    }

    Kill()
    {
        this.spriteIndex = 185;
        this.alive = false;
        this.phys.velocity = [0, 0];
    }

    Input(input)
    {
        if(this.alive)
        {
            if(input.up)
            {
                this.phys.velocity = [ this.phys.velocity[0] , this.walkSpeed ];
            }
            else if(input.down)
            {
                this.phys.velocity = [ this.phys.velocity[0], -this.walkSpeed];
            }
            else 
            {
                this.phys.velocity = [ this.phys.velocity[0], 0 ];
            }

            if(input.right)
            {
                this.phys.velocity = [ this.walkSpeed, this.phys.velocity[1] ];
            }
            else if(input.left)
            {
                this.phys.velocity = [ -this.walkSpeed, this.phys.velocity[1] ];
            }
            else
            {
                this.phys.velocity = [ 0, this.phys.velocity[1] ]; 
            }
        }
        else 
        {
            if(input.esc)
            {
                SETUP();
            }
        }
    }

    /*
    GetScreenPos()
    {
        return { x: this.phys.position[0] - 0.5 * this.width, y: -(this.phys.position[1]+0.5*this.height) };
    }*/

    Draw()
    {
        let screenPos = this.GetScreenPos();

        sprite(this.spriteIndex, screenPos.x, screenPos.y);
    }
    
}