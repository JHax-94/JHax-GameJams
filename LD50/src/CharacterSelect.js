import { changeCharacter, CHARACTER, CHARACTER_MAX, consoleLog, EM, getObjectConfig, getPlayerPref, PIXEL_SCALE, setPlayerPref } from "./main";

export default class CharacterSelect
{
    constructor(position)
    {
        this.pos = position;

        let config = getObjectConfig("CharacterSelect");

        this.frameTime = 0;
        this.currentFrame = 0;

        this.anims = config.anims;

        EM.RegisterEntity(this);
    }

    Update(deltaTime)
    {
        this.frameTime += deltaTime;

        if(this.frameTime >= this.anims[CHARACTER].frameTime)
        {
            this.frameTime -= this.anims[CHARACTER].frameTime;

            this.currentFrame = (this.currentFrame + 1) % this.anims[CHARACTER]["head"].length;
        }
    }
    
    ChangeCharacter(dir)
    {
        let newChar = (CHARACTER + dir + CHARACTER_MAX) % CHARACTER_MAX;

        changeCharacter(newChar);
    }

    Draw()
    {
        paper(6);
        rectf((this.pos.x -0.25 )* PIXEL_SCALE, (this.pos.y -0.25) * PIXEL_SCALE, 1.5* PIXEL_SCALE , (2.5)* PIXEL_SCALE);

        pen(4);
        rect((this.pos.x -0.25 )* PIXEL_SCALE, (this.pos.y -0.25) * PIXEL_SCALE, 1.5* PIXEL_SCALE , (2.5)* PIXEL_SCALE);

        let head = this.anims[CHARACTER]["head"][this.currentFrame];
        let body = this.anims[CHARACTER]["body"][this.currentFrame];

        sprite(head.index, this.pos.x * PIXEL_SCALE, this.pos.y * PIXEL_SCALE, head.flipH, head.flipV, head.flipR );
        sprite(body.index, this.pos.x * PIXEL_SCALE, (this.pos.y + 1) * PIXEL_SCALE, body.flipH, body.flipV, body.flipR );
    }

    
}
