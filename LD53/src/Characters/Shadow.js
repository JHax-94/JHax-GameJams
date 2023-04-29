import { EM } from "../main";

export default class Shadow
{
    constructor(source, offset, opts)
    {
        let setRenderLayer = "CRITTER_SHADOW";

        this.renderLayer = setRenderLayer;

        this.source =  source;
        this.offset = offset;

        this.sprite = 16

        EM.RegisterEntity(this);
    }

    Draw()
    {
        let basePos = this.source.GetScreenPos();

        sprite(this.sprite, basePos.x + this.offset.x, basePos.y + this.offset.y);
    }
}