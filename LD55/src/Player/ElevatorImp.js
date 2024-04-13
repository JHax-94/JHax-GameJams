import { EM, consoleLog } from "../main";

export default class ElevatorImp
{
    constructor(tile, def)
    {
        this.spriteIndex = def.index;

        let physSettings = {
            tileTransform: { x: tile.x, y: tile.y, w: 1, h: 1 },
            mass: 100,
            isSensor: false,
            freeRotate: false,
            isKinematic: false,
            tag: "PLAYER",
            material: "playerMaterial",
            linearDrag: 0.95
        };

        this.Setup();

        EM.RegisterEntity(this, { physSettings: physSettings })        
    }

    Setup()
    {
        this.speed = 10;
    }


    Input(input)
    {
        if(input.left)
        {
            this.phys.velocity = [ -this.speed, this.phys.velocity[1] ];
        }
        else if(input.right)
        {
            this.phys.velocity = [ this.speed, this.phys.velocity[1] ];
        }
    }

    Update(deltaTime)
    {

    }

    Draw()
    {
        
        let screenPos = this.GetScreenPos();

        EM.hudLog.push(`draw imp [${this.index}] @ (${screenPos.x}, ${screenPos.y})`);

        sprite(this.spriteIndex, screenPos.x, screenPos.y);
    }


}